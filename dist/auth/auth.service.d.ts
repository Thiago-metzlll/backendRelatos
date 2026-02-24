import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(data: any): Promise<any>;
    login(data: any): Promise<{
        user: {
            id: any;
            nome: any;
            email: any;
        };
        access_token: string;
    }>;
}
