import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(data: any): Promise<{
        id: number;
        email: string;
        nome: string;
        createdAt: Date;
    }>;
    login(data: any): Promise<{
        user: {
            id: number;
            nome: string;
            email: string;
        };
        access_token: string;
    }>;
}
