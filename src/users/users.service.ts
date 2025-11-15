import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async findByEmail(email: string) {
    return this.usersRepo.findOne({ where: { email } });
  }

  async create( username:string,email: string, password: string) {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const user = this.usersRepo.create({username, email, password: hashed });
    return this.usersRepo.save(user);
  }

  async validateUser(email: string, plaintextPassword: string) {
    const user = await this.findByEmail(email);
    if (!user) return null;
    const matches = await bcrypt.compare(plaintextPassword, user.password);
    return matches ? user : null;
  }
}
