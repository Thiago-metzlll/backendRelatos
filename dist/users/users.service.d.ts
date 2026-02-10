import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    update(id: number, data: {
        avatarUrl?: string;
        nome?: string;
    }): Promise<{
        id: number;
        email: string;
        nome: string;
        senha: string;
        xp: number;
        nivel: number;
        insignias: string[];
        avatarUrl: string | null;
        createdAt: Date;
    }>;
    findOne(id: number): Promise<{
        id: number;
        email: string;
        nome: string;
        senha: string;
        xp: number;
        nivel: number;
        insignias: string[];
        avatarUrl: string | null;
        createdAt: Date;
    } | null>;
}
