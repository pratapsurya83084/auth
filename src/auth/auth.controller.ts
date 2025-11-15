import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  ValidationPipe,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from '../users/dto/login.dto';
// import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('/api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    console.log('Register DTO ->', createUserDto);
    return this.authService.register(createUserDto);
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(dto.email, dto.password);

    if (!user) {
      return { statusCode: 401, message: 'Invalid credentials' };
    }

    const result = await this.authService.login(user);

    // Set cookie
    // res.cookie('jwt', result.access_token, {
    //   httpOnly: true,
    //   secure: false,         // Set true ONLY if using HTTPS
    //   sameSite: 'lax',
    //   maxAge: 60 * 60 * 1000 // 1 hour
    // });

    // RETURN RESPONSE !!
    return {
      message: 'Login successful',
     token:result.access_token,
      success: true,
      user: { id: user.id, email: user.email },
    };
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // getProfile(@Request() req) {
  //   return req.user;
  // }



  @Post('logout')
logout(@Res({ passthrough: true }) res: Response) {
  // res.clearCookie('jwt');

  return {
    message: 'Logout successful',
    success: true,
  };
}

}
