import { ConflictException, HttpCode, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { log } from 'console';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/users.entity';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { verificationCodeBody } from './dto/verification-code-body.dto';
import { ResponseBody } from '../common/interfaces/response-body.interface';
import { ContentCreator } from '../content_creators/entities/content-creators.entity';
import { Step } from '../utils/enums/steps.enum';
import { CreateProfileBody } from './dto/create-profile.dto';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService,
        private jwtService: JwtService,

        @InjectRepository(User)
        private userRepository: Repository<User>,

        @InjectRepository(ContentCreator)
        private contentCreatorRepo: Repository<ContentCreator>,
    ) { }




    async resetPassword(token: string, pass: string): Promise<ResponseBody<undefined>> {
        await this.usersService.resetPassword(token, pass);
        return {
            statusCode: HttpStatus.OK,
            message: 'Password has been successfully reset.'
        };
    }


    async sendResetPassword(email: string): Promise<ResponseBody<undefined>> {
        await this.usersService.sendResetPasswordToken(email);
        return {
            statusCode: HttpStatus.OK,
            message: 'A password reset link has been sent to your email address. Please check your inbox to proceed.',
        };
    }

    async createProfileSteps(createProfileBody: CreateProfileBody, email: string): Promise<ResponseBody<undefined>> {

        await this.usersService.createProfileSteps(createProfileBody, email);
        return {
            statusCode: HttpStatus.OK,
            message: `Step ${createProfileBody.step} successfully added`,
        };
    }

    async createCreatorProfileImage(imagePath: string, email: string): Promise<ResponseBody<ContentCreator>> {

        const contentCreator: ContentCreator = await this.usersService.createCreatorProfileImage(imagePath, email);
        return {
            statusCode: HttpStatus.OK,
            message: `Step ${Step.PROFILE_PIC} successfully added`,
            response: contentCreator,
        };
    }



    async refreshToken(refreshToken: string): Promise<ResponseBody<any>> {



        const user: User = await this.usersService.updateUserTokens(refreshToken);

        return {
            statusCode: HttpStatus.OK,
            message: "Successfully Refresh Token",
            response: {
                "accessToken": user.accessToken, 
                "refreshToken": user.refreshToken,
            },
        };
    }


    async signIn(email: string, pass: string): Promise<ResponseBody<any>> {

        const user: User = await this.usersService.validateUser(email.toLowerCase(), pass);

        const { password, ...result } = user;
        return {
            statusCode: HttpStatus.OK,
            message: "Successfully Login",
            response: result,
        };
    }



    async signUp(createUserDto: CreateUserDto): Promise<ResponseBody<any> | undefined> {
        const user = await this.usersService.findUser(createUserDto.email);
        console.log(`User ${user}`);

        if (user) {
            throw new ConflictException('User with this email already exists');
        }

        const userData = await this.usersService.createUser(createUserDto);


        const { password, ...result } = userData;


        return {
            statusCode: HttpStatus.CREATED,
            message: 'Successfully Created',
            response: result,
        };

    }

    async sendVerificationCode(email: string): Promise<ResponseBody<undefined>> {
        const _email = email.toLowerCase();
        const user = await this.usersService.findUser(email.toLowerCase());
        if (!user) {
            throw new HttpException("User not found", HttpStatus.NOT_FOUND);
        }
        if (user.isVerified) {
            throw new HttpException("Already Verified", HttpStatus.BAD_REQUEST);
        }

        await this.usersService.sendVerificationToUser(user.id, user.email);

        return {
            statusCode: HttpStatus.OK,
            message: 'Successfully send code',
        };

    }

    async checkVerificationCode(body: verificationCodeBody): Promise<ResponseBody<undefined>> {
        const user = await this.usersService.findUser(body.email);
        if (!user) {
            throw new HttpException("User not found", HttpStatus.NOT_FOUND);
        }

        if (user.isVerified) {
            throw new HttpException("Already Verified", HttpStatus.BAD_REQUEST);
        }

        if (user.verificationCode != body.code) {
            throw new HttpException("Incorrect Code", HttpStatus.NOT_FOUND);
        }


        const isVerificationExpired: boolean = this.isVerificationExpired(user.verificationExpiry, 10);

        if (isVerificationExpired) {
            throw new HttpException("Your code is expired", HttpStatus.BAD_REQUEST);
        }


        if (user && user.verificationCode == body.code) {

            this.userRepository.update({ id: user.id }, {
                isVerified: true,
            });
            this.contentCreatorRepo.update({ userId: user.id }, {
                stepId: Step.CITY_LOCATED,
            })
        }

        return {
            statusCode: HttpStatus.OK,
            message: 'Your Profile is successfully registered',
        };

    }


    private isVerificationExpired(expiryTime: string, expiryMinutes: number): boolean {
        const expiryDate = new Date(expiryTime);

        const currentDate = new Date();

        const diffInMs = currentDate.getTime() - expiryDate.getTime();

        // Convert the difference from milliseconds to minutes
        const diffInMinutes = diffInMs / (1000 * 60);

        return diffInMinutes > expiryMinutes;
    }


}

