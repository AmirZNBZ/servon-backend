import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private users: { email: string; passwordHash: string }[] = [];

  async register(dto: RegisterDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);

    this.users.push({
      email: dto.email,
      passwordHash,
    });

    return { message: 'User Registered' };
  }

  async login(dto: LoginDto) {
    const user = this.users.find((user) => user.email === dto.email);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    return { message: 'login success' };
  }
}
