import { Body, Controller, HttpStatus, MaxFileSizeValidator, ParseFilePipe, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../common/decorators/public.decorator';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Response } from 'express'
import { verificationCodeBody } from './dto/verification-code-body.dto';
import { signInDto } from './dto/signin.dto';
import { SendVerificationBody } from './dto/send-verification-body.dto';
import { CreateProfileBody } from './dto/create-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResetPasswordBodyDto } from './dto/reset-password-body.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }


  @Public()
  @Post('creator/signup')
  signUp(@Body() createUserDto: CreateUserDto, @Res({ passthrough: true }) res: Response) {
    res.status(HttpStatus.CREATED);
    return this.authService.signUp(createUserDto);

  }


  @Public()
  @Post('creator/check-verification-code')
  checkVerificationCode(@Body() verificationCodeBody: verificationCodeBody,
    @Res({ passthrough: true }) res: Response
  ) {
    res.status(HttpStatus.OK);
    return this.authService.checkVerificationCode(verificationCodeBody);
  }

  @Public()
  @Post('creator/send-verification-code')
  sendVerificationCode(@Body() sendVerificationBody: SendVerificationBody, @Res({ passthrough: true }) res: Response) {
    res.status(HttpStatus.OK);
    return this.authService.sendVerificationCode(sendVerificationBody.email);
  }


  @Public()
  @Post('creator/refresh-token')
  refreshToken(@Body('refreshToken') refreshToken: string, @Res({ passthrough: true }) res: Response) {
    res.status(HttpStatus.OK);
    return this.authService.refreshToken(refreshToken);
  }

  @Public()
  @Post('creator/login')
  signIn(@Body() signInDto: signInDto, @Res({ passthrough: true }) res: Response) {
    res.status(HttpStatus.OK);
    return this.authService.signIn(signInDto.email, signInDto.password);
  }



  @Public()
  @Post('creator/send-reset-password')
  sendResetPassword(@Body() sendVerificationBody: SendVerificationBody, @Res({ passthrough: true }) res: Response) {
    res.status(HttpStatus.OK);
    return this.authService.sendResetPassword(sendVerificationBody.email);
  }

  @Public()
  @Post('creator/reset-password')
  resetPassword(@Body() resetPasswordBodyDto: ResetPasswordBodyDto, @Res({ passthrough: true }) res: Response) {
    res.status(HttpStatus.OK);
    return this.authService.resetPassword(resetPasswordBodyDto.token, resetPasswordBodyDto.password);
  }
  @Post('creator/create-profile-steps')
  @UseInterceptors(FileInterceptor('profileImage'))
  createProfileSteps(
    @Body() createProfileBody: CreateProfileBody,
    @UploadedFile(new ParseFilePipe({
      validators: [new MaxFileSizeValidator({ maxSize: 100000 }) /** max 12.5 MB */],
      fileIsRequired: false,
    }))
    file: Express.Multer.File,
    @Req() req,
    @Res({ passthrough: true }) res: Response
  ) {
    res.status(HttpStatus.OK);

    if (file || !createProfileBody) {
      const filePath = `${file.destination}/${file.filename}`;
      console.log(`Uploaded File: ${filePath}`);
      return this.authService.createCreatorProfileImage(filePath, req.user.email);
    } else {
      return this.authService.createProfileSteps(createProfileBody, req.user.email);
    }
  }

}
