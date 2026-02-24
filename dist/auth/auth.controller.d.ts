import { AuthService } from './auth.service';
import type { Response } from 'express';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(body: any): Promise<any>;
    login(body: any, response: Response): Promise<{
        user: {
            id: any;
            nome: any;
            email: any;
        };
        access_token: string;
    }>;
    logout(response: Response): Promise<{
        message: string;
    }>;
}
