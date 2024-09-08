import {
    HttpException,
    HttpStatus,
    Injectable,
    UnsupportedMediaTypeException,
} from '@nestjs/common';
import { User } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { ContentCreator } from '../content_creators/entities/content-creators.entity';
import { hash, compare } from 'bcrypt';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { SentMessageInfo } from 'nodemailer';
import { APP_NAME, VERFICATION_EXPIRY_IN_MINUTES } from '../auth/auth.constants';
import { CreateProfileBody } from '../auth/dto/create-profile.dto';
import { Step } from '../utils/enums/steps.enum';
import { configuration } from 'config';
import { unlink } from 'fs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(ContentCreator)
        private contentCreatorRepo: Repository<ContentCreator>,

        private dataSource: DataSource,
        private jwtService: JwtService,
        private configService: ConfigService,
        private readonly mailService: MailerService,
    ) { }


    async resetPassword(token: string, pass: string): Promise<void> {
        const user = await this.userRepository.findOne({ where: { resetToken: token } });
        if (!user) {
            throw new HttpException('Invalid Token', HttpStatus.BAD_REQUEST);
        }
        console.log(`OLD PASSWORD (${user.password})`);
        console.log(`NEW PASSWORD (${pass})`);
        console.log(`MATCHED PASSWORD (${user.password == pass})`);

        const isPassMatched: boolean = await this.isPasswordMatched(pass, user.password);
        if (isPassMatched) {
            throw new HttpException('This password was already in use', HttpStatus.BAD_REQUEST);

        }
        if (new Date() > user.resetTokenExpiry) {
            throw new HttpException('The password reset link has expired. Please request a new one.', HttpStatus.BAD_REQUEST);
        }

        const hashedPassword: string = await this.hashPassword(pass);

        user.password = hashedPassword;
        user.resetToken = null;
        user.resetTokenExpiry = null;

        await this.userRepository.save(user);

    }

    async sendResetPasswordToken(email: string): Promise<void> {
        const user = await this.findUser(email);
        if (!user) {
            throw new HttpException('No User Found', HttpStatus.BAD_REQUEST);
        }
        // if (!user.isVerified) {
        //     throw new HttpException('User not verified', HttpStatus.BAD_REQUEST);
        // }
        

        const payload = { id: user.id, email: user.email };

        const userResetToken = await this.generateToken(payload, '5m');
        const userDateExpiry = new Date();
        userDateExpiry.setMinutes(userDateExpiry.getMinutes() + 5);
        user.resetToken = userResetToken;
        user.resetTokenExpiry = userDateExpiry;

        const resetLink = `http://localhost:8081/reset-password?token=${userResetToken}`;
        await this.sendForgotPasswordMail(resetLink, email)
        await this.userRepository.save(user);

    }


    async updateUserTokens(refreshToken: string): Promise<User> {

        try {
            await this.jwtService.verify(refreshToken);

            const user = await this.userRepository.findOne({ where: { refreshToken: refreshToken } })

            if (!user) {
                throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
            }


            const payload = { id: user.id, email: user.email };
            // Generate new tokens
            const updatedAcessToken = await this.generateToken(payload, '1h');
            const updatedRefreshToken = await this.generateToken(payload, '7d');
            const tokenExpiry = this.calculateExpiry(60);
            user.accessToken = updatedAcessToken;
            user.refreshToken = updatedRefreshToken;
            user.tokenExpiry = tokenExpiry;

            return await this.userRepository.save(user);

        } catch (error) {
            if (error instanceof TokenExpiredError) {
                throw new HttpException('Refresh token expired', HttpStatus.UNAUTHORIZED);
            } else {
                throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
            }
        }

    }


    async validateUser(email: string, pass: string): Promise<User> {
        const user = await this.findUser(email);
        if (!user) {
            throw new HttpException('User not Found', HttpStatus.NOT_FOUND);
        }

        // if (!user.isVerified) {
        //     throw new HttpException('User not verified', HttpStatus.BAD_REQUEST);
        // }

        const isPassMatched = await this.isPasswordMatched(pass, user.password);

        if (!isPassMatched) {
            throw new HttpException('Incorrect Password', HttpStatus.BAD_REQUEST);
        }

        const payload = { id: user.id, email: user.email };
        const accessToken = await this.generateToken(payload, '1h');
        const refreshToken = await this.generateToken(payload, '7d');
        console.log(`AccessToken  ${accessToken}`);
        console.log(`refreshToken  ${refreshToken}`);

        const tokenExpiry = this.calculateExpiry(15);

        user.accessToken = accessToken;
        user.refreshToken = refreshToken;
        user.tokenExpiry = tokenExpiry;

        return await this.userRepository.save(user);
    }

    async createUser(createUserDto: CreateUserDto): Promise<User | undefined> {
        const hashedPassword: string = await this.hashPassword(
            createUserDto.password,
        );

        const verificationCode = this.generateVerificationCode();
        const verificationExpiry = this.calculateExpiry(
            VERFICATION_EXPIRY_IN_MINUTES,
        );


        const fullName: string[] = createUserDto.fullName.trim().split(' ');

        return await this.dataSource.transaction(async (enitityManager) => {
            const createdUser = this.userRepository.create({
                email: createUserDto.email,
                password: hashedPassword,
                verificationCode: verificationCode,
                verificationExpiry: verificationExpiry,
            });

            await enitityManager.save(createdUser);

            const createdContentCreator = this.contentCreatorRepo.create({
                name: fullName[0],
                surname: fullName[1] || '',
                userId: createdUser.id,
            });

            await this.sendVerificationMail(createdUser.verificationCode, createdUser.email);
            await enitityManager.save(createdContentCreator);

            return createdUser;
        });
    }

    async sendVerificationToUser(userId: number, userEmail: string) {
        try {
            const verificationCode = this.generateVerificationCode();
            const verificationExpiry = this.calculateExpiry(
                VERFICATION_EXPIRY_IN_MINUTES,
            );

            await this.sendVerificationMail(verificationCode, userEmail);
            await this.userRepository.update(
                { id: userId },
                {
                    verificationCode: verificationCode,
                    verificationExpiry: verificationExpiry,
                },
            );
        } catch (e) {
            console.log(`Error on sending code: ${e}`);
            throw new HttpException(
                `Error on sending code: ${e}`,
                HttpStatus.EXPECTATION_FAILED,
            );
        }
    }

    async createCreatorProfileImage(imagePath: string, email: string): Promise<ContentCreator> {
        const userId = (await this.findUser(email)).id;
        const contentCreator = await this.contentCreatorRepo.findOne({
            where: { userId: userId },
        });


        if (contentCreator.stepId == 8) {
            unlink(imagePath, () => { console.log('File was deleted'); })
            throw new HttpException(`Already uploaded profile image `, HttpStatus.BAD_REQUEST,);
        }

        if (contentCreator.stepId < 7) {
            unlink(imagePath, () => { console.log('File was deleted'); })
            throw new HttpException(`File upload is not allowed unless step is 7`, HttpStatus.BAD_REQUEST,);
        }


        contentCreator.profileImage = imagePath;
        contentCreator.stepId = Step.PROFILE_PIC;

        return await this.contentCreatorRepo.save(contentCreator);
    }

    async createProfileSteps(
        createProfileBody: CreateProfileBody,
        email: string,
    ) {
        const user = await this.findUser(email);
        const userId = user.id;
        const contentCreator = await this.contentCreatorRepo.findOne({
            where: { userId: userId },
        });

        this.validateSteps(contentCreator, createProfileBody);

        switch (createProfileBody.step) {
            case Step.CITY_LOCATED:
                contentCreator.city = createProfileBody.city;
                contentCreator.stepId = Step.CITY_LOCATED;
                break;
            case Step.GENDER:
                contentCreator.gender = createProfileBody.gender;
                contentCreator.stepId = Step.GENDER;
                break;
            case Step.DOB:
                contentCreator.dob = new Date(createProfileBody.dob);
                contentCreator.stepId = Step.DOB;
                break;
            case Step.INTERESTED_COLLABORATIONS:
                contentCreator.collaboratorsInterests =
                    createProfileBody.collaboratorsInterests;
                contentCreator.stepId = Step.INTERESTED_COLLABORATIONS;
                break;
            case Step.LANGUAGES:
                contentCreator.languagesSpoken = createProfileBody.languagesSpoken;
                contentCreator.stepId = Step.LANGUAGES;
                break;
            case Step.NICHES:
                contentCreator.niche = createProfileBody.niche;
                contentCreator.stepId = Step.NICHES;
                break;
            case Step.SPECIAL_CHARACTERISTICS:
                contentCreator.specialAttributes = createProfileBody.specialAttributes;
                contentCreator.stepId = Step.SPECIAL_CHARACTERISTICS;
                break;
            default:
                throw new HttpException(
                    `Error on adding steps `,
                    HttpStatus.BAD_REQUEST,
                );

        }

        this.contentCreatorRepo.save(contentCreator);

    }




    /**  ------  These Method is used in different functions for specific purpose.  */

    private validateSteps(contentCreator: ContentCreator, createProfileBody: CreateProfileBody) {
        const stepValidations = {
            [Step.GENDER]: () => {
                if (!contentCreator.city) {
                    throw new HttpException(
                        'City must be completed before setting gender',
                        HttpStatus.BAD_REQUEST,
                    );
                }
            },
            [Step.DOB]: () => {
                if (!contentCreator.gender) {
                    throw new HttpException(
                        'Gender must be completed before setting date of birth',
                        HttpStatus.BAD_REQUEST,
                    );
                }
            },
            [Step.INTERESTED_COLLABORATIONS]: () => {
                if (!contentCreator.dob) {
                    throw new HttpException(
                        'Date of Birth must be completed before setting interested collaborations',
                        HttpStatus.BAD_REQUEST,
                    );
                }
            },
            [Step.LANGUAGES]: () => {
                if (!contentCreator.collaboratorsInterests) {
                    throw new HttpException(
                        'Interested Collaborations must be completed before setting languages',
                        HttpStatus.BAD_REQUEST,
                    );
                }
            },
            [Step.NICHES]: () => {
                if (!contentCreator.languagesSpoken) {
                    throw new HttpException(
                        'Languages must be completed before setting niches',
                        HttpStatus.BAD_REQUEST,
                    );
                }
            },
            [Step.SPECIAL_CHARACTERISTICS]: () => {
                if (!contentCreator.niche) {
                    throw new HttpException(
                        'Niches must be completed before setting special characteristics',
                        HttpStatus.BAD_REQUEST,
                    );
                }
            },
        };

        const step = createProfileBody.step as Step;


        if (stepValidations[step]) {
            stepValidations[step]();
        }
    }



    async findUser(userEmail: string): Promise<User> {
        return this.userRepository.findOne({ where: { email: userEmail } });
    }

    async isPasswordMatched(
        password: string,
        hashedPassword: string,
    ): Promise<boolean> {
        return await compare(password, hashedPassword);
    }


    private async sendMail(
        email: string,
        message: string,
        subject: string,
    ): Promise<SentMessageInfo> {
        return await this.mailService.sendMail({
            to: email,
            from: 'Swai admin <testuser@gmail.com>',
            subject: `${APP_NAME} - ${subject}`,
            text: message,
        });
    }



    private async sendForgotPasswordMail(
        message: string,
        email: string,
    ): Promise<SentMessageInfo> {
        const sendMessage = `Click to reset password ${message}`;
        const subject = `Forgot Password`;
        return this.sendMail(email, sendMessage, subject);
    }

    private async sendVerificationMail(
        code: string,
        email: string,
    ): Promise<SentMessageInfo> {
        const message = `Your Verification code is: ${code}`;
        const subject = `Verifiication Code`;

        return this.sendMail(email, message, subject);

        // return await this.mailService.sendMail({
        //     from: 'Swai admin <testuser@gmail.com>',
        //     to: email,
        //     subject: `${APP_NAME} - Verifiication Code`,
        //     text: message,
        // });
    }


    private async hashPassword(password: string): Promise<string> {
        const saltOrRounds = 10;
        return await hash(password, saltOrRounds);
    }

    private async generateToken(
        payload: object,
        expiresIn: string,
    ): Promise<string> {
        const secret = this.configService.get<string>('JWT_SECRET_KEY');
        return await this.jwtService.signAsync(payload, { secret, expiresIn });
    }

    private calculateExpiry(minutes: number): string {
        return new Date(Date.now() + minutes * 60 * 1000).toISOString();
    }

    private generateVerificationCode(length: number = 6): string {
        const digits = '0123456789';
        let code = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * digits.length);
            code += digits[randomIndex];
        }
        return code;
    }
}
