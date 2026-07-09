import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    ) {}

  async register(registerDto: RegisterDto) {
    const { name, email, password } = registerDto;

    // Check if email already exists
    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.usersService.create(
      name,
      email,
      hashedPassword,
    );

    // Don't return password
    const { password: _, ...result } = user;

    return result;
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
        throw new BadRequestException('Invalid email');
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        user.password,
    );

    if (!isPasswordValid) {
        throw new BadRequestException('Invalid password');
    }

    const payload = {
        sub: user.id,
        email: user.email,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
        accessToken,
    };
  }
}