import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ContentCreator } from './entities/content-creators.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/users.entity';
import { Repository } from 'typeorm';
import { ResponseBody } from 'src/common/interfaces/response-body.interface';
import { log } from 'console';
import { GetCreatorsDto } from './dto/get-creator.dto';

@Injectable()
export class ContentCreatorService {
    constructor(
        private usersService: UsersService,

        @InjectRepository(User)
        private userRepository: Repository<User>,

        @InjectRepository(ContentCreator)
        private contentCreatorRepo: Repository<ContentCreator>,
    ) { }

    async getCreatorProfile(
        email: string,
    ): Promise<ResponseBody<ContentCreator>> {
        const user: User = await this.usersService.findUser(email);
        if (!user) {
            throw new HttpException('No User Found', HttpStatus.BAD_REQUEST);
        }

        const contentCreator: ContentCreator =
            await this.contentCreatorRepo.findOne({
                where: { userId: user.id },
            });

        return {
            statusCode: HttpStatus.OK,
            message: 'Successfully fetched Creator Profie',
            response: contentCreator,
        };
    }

    async getCreators(creatorDto: GetCreatorsDto): Promise<ResponseBody<any>> {
        const page = creatorDto.page;
        const limit = creatorDto.limit;

        console.log('page', page);
        console.log('limit', limit);
        console.log('languages', creatorDto.languages);

        const queryBuilder =
            this.contentCreatorRepo.createQueryBuilder('content_creator');


        // Apply filters
        if (creatorDto.languages) {
            const languageArray = creatorDto.languages.split(',').map((e) => e);
            queryBuilder.andWhere(
                'EXISTS (SELECT 1 FROM unnest(content_creator.languagesSpoken) AS lang WHERE LOWER(lang) = ANY(:languages))',
                { languages: languageArray },
            );
        }

        if (creatorDto.location) {
            const locationArray = creatorDto.location.split(',').map((e) => e);
            queryBuilder.andWhere('LOWER(content_creator.city) IN (:...cities)', {
                cities: locationArray,
            });
            
        }

        if (creatorDto.gender) {
            const genderArray = creatorDto.gender.split(',').map((e) => e);
            queryBuilder.andWhere('LOWER(content_creator.gender) IN (:...genders)', {
                genders: genderArray,
            });
        }


        if(creatorDto.topics){
            const topicsArray = creatorDto.topics.split(',').map((e) => e);

            queryBuilder.andWhere(
                'EXISTS (SELECT 1 FROM unnest(content_creator.niche) AS niche WHERE LOWER(niche) = ANY(:niches))',
                { niches: topicsArray },
            );

        }

        if (creatorDto.characteristics) {
            const specialAttributesArray = creatorDto.characteristics.split(',').map((e) => e);

            queryBuilder.andWhere('EXISTS (SELECT 1 FROM unnest(content_creator.specialAttributes) AS attr WHERE LOWER(attr) = ANY(:specialAttributes))',
                { specialAttributes: specialAttributesArray });
        }
   

        // Apply pagination
        const skip = (Number(page) - 1) * Number(limit);
        const [contentCreators, total] = await queryBuilder
            .skip(skip)
            .take(limit)
            .getManyAndCount();

        return {
            statusCode: HttpStatus.OK,
            message: 'Successfully fetched Content Creators',
            response: {
                total,
                page,
                limit,
                contentCreators,
            },
        };
    }
}
