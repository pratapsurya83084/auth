import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  ValidationPipe,
  Res,
  Req,
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
    // console.log("user from dto : ",user)
    if (!user) {
      return { statusCode: 401, message: 'Invalid credentials' };
    }
    const result = await this.authService.login(user);


    // RETURN RESPONSE !!
    return {
      message: 'Login successful',
     token:result.access_token,
      success: true,
      user: { id: user.id, email: user.email },
    };
  }

  @UseGuards(JwtAuthGuard)   // middleware to protect this route
  @Get('profile')
  getProfile(@Request() req) {
    //  console.log('auth header:', req.headers.authorization); // token present
    // console.log('req.user:', req.user); // user

    return ({
      message:'User profile fetched successfully',
      success:true,
      userProfile : req.user
    })
  }



@Post('logout')
 async logout(@Req() req: Request) {
    // req.headers['authorization'] is the proper way
    const authHeader = req.headers['authorization'];

    // Ensure header exists and is a string
    if (authHeader && typeof authHeader === 'string') {
      const token = authHeader.split(' ')[1]; // extract Bearer token
      if (token) {
        await this.authService.deleteRefreshToken(token); // invalidate token
      }
    }

    return {
      // user:req.u,
      message: 'Logout successful',
      success: true,
    };
  }

}
