import { AuthService } from './auth.service';
import type { Response } from 'express';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(body: any): Promise<{
        id: number;
        email: string;
        nome: string;
        xp: number;
        nivel: number;
        insignias: string[];
        avatarUrl: string | null;
        createdAt: Date;
    }>;
    login(body: any, response: Response): Promise<{
        user: {
            id: number;
            nome: string;
            email: string;
            xp: number;
            nivel: number;
            insignias: string[];
            avatarUrl: string | null;
        };
        access_token: string;
    }>;
    logout(response: Response): Promise<{
        message: string;
    }>;
}
