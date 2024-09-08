import { Controller, Get, HttpStatus, Query, Req, Res } from '@nestjs/common';
import { ContentCreatorService } from './content-creator.service';
import { Response } from 'express'
import { GetCreatorsDto } from './dto/get-creator.dto';

@Controller('creator')
export class ContentCreatorController {
    constructor(private contentCreatorService: ContentCreatorService) { }


    @Get('profile')
    getProfile(@Req() req, @Res({ passthrough: true }) res: Response) {
        res.status(HttpStatus.OK);
        return this.contentCreatorService.getCreatorProfile(req.user.email);
    }


    @Get('get-creators')
    getCreators(
        @Query() creatorDto: GetCreatorsDto,
        @Res({ passthrough: true }
        ) res: Response) {
        res.status(HttpStatus.OK);
        return this.contentCreatorService.getCreators(creatorDto);
    }


}
