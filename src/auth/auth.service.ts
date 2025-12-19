import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  private users: { email: string; passwordHash: string }[] = [];

  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  generateAccessToken(userId: string) {
    return this.jwtService.sign(
      { sub: userId },
      {
        secret: this.config.get('JWT_ACCESS_SECRET'),
        expiresIn: this.config.get('JWT_ACCESS_EXPIRES'),
      },
    );
  }

  generateRefreshToken(userId: string) {
    return this.jwtService.sign(
      { sub: userId },
      {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get('JWT_REFRESH_EXPIRES'),
      },
    );
  }

  refresh(token: string) {
    const payload: { sub: string } = this.jwtService.verify(token, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
    });

    const newAccessToken = this.generateAccessToken(payload.sub);
    const newRefreshToken = this.generateRefreshToken(payload.sub);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async register(dto: RegisterDto) {
    const user = this.users.find((user) => user.email === dto.email);

    if (user) {
      throw new Error('User With This UserName Are Exist');
    }

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

    const accessToken = this.generateAccessToken(user.email);
    const refreshToken = this.generateRefreshToken(user.email);

    return { accessToken, refreshToken };
  }
}
