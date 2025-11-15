import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    return this.usersService.validateUser(email, pass);
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email };
    const token =  this.jwtService.sign(payload);
   
    return {
      message: 'login successfull',
      success: true,
      access_token:token,
      user: { id: user.id, email: user.email },
    };
  }

  async register(dto: CreateUserDto) {
    const exists = await this.usersService.findByEmail(dto.email);
    if (exists) throw new BadRequestException('Email already in use');

    // ensure all three params forwarded
    const user = await this.usersService.create(
      dto.username,
      dto.email,
      dto.password,
    );
    // return whatever you need (avoid returning password)
    return {
      message: 'user register successfull',
      success: true,
      id: user.id,
      email: user.email,
      username: user.username,
    };
  }
}
