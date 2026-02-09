import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import type { Response } from 'express';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async register(data: any) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            throw new ConflictException('Email já cadastrado');
        }

        const hashedPassword = await bcrypt.hash(data.senha, 10);

        const user = await this.prisma.user.create({
            data: {
                nome: data.nome,
                email: data.email,
                senha: hashedPassword,
            },
        });

        const { senha, ...userWithoutSenha } = user;
        return userWithoutSenha;
    }

    async login(data: any) {
        console.log('Login attempt received for email:', data.email);
        const user = await this.prisma.user.findUnique({
            where: { email: data.email },
        });

        if (!user) {
            console.log('User not found for email:', data.email);
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const isMatch = await bcrypt.compare(data.senha, user.senha);
        console.log('Password match result:', isMatch);

        if (!isMatch) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const payload = { sub: user.id, email: user.email };
        const token = this.jwtService.sign(payload);

        return {
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
            },
            access_token: token,
        };
    }
}
