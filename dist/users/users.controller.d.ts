import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    updateProfile(req: any, data: {
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
}
