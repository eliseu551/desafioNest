import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export interface AuthResponse {
    accessToken: string;
    user: Omit<User, 'passwordHash'>;
}
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<AuthResponse>;
    login(dto: LoginDto): Promise<AuthResponse>;
    profile(userId: number): Promise<{
        name: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    } | null>;
    private buildResponse;
}
