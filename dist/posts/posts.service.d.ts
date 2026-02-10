import { PrismaService } from '../prisma/prisma.service';
export declare class PostsService {
    private prisma;
    constructor(prisma: PrismaService);
    createPost(userId: number, data: any): Promise<{
        user: {
            nome: string;
        };
        tipoRelato: {
            id: number;
            nome: string;
            descricao: string | null;
        };
    } & {
        id: number;
        createdAt: Date;
        conteudo: string;
        quantidadeVts: number;
        userId: number;
        tipoRelatoId: number;
    }>;
    findAll(tipoRelatoId?: number): Promise<({
        user: {
            nome: string;
        };
        tipoRelato: {
            id: number;
            nome: string;
            descricao: string | null;
        };
    } & {
        id: number;
        createdAt: Date;
        conteudo: string;
        quantidadeVts: number;
        userId: number;
        tipoRelatoId: number;
    })[]>;
    upvote(userId: number, postId: number): Promise<{
        id: number;
        createdAt: Date;
        conteudo: string;
        quantidadeVts: number;
        userId: number;
        tipoRelatoId: number;
    }>;
    findByUser(userId: number): Promise<({
        user: {
            id: number;
            email: string;
            nome: string;
            senha: string;
            xp: number;
            nivel: number;
            insignias: string[];
            avatarUrl: string | null;
            createdAt: Date;
        };
        tipoRelato: {
            id: number;
            nome: string;
            descricao: string | null;
        };
    } & {
        id: number;
        createdAt: Date;
        conteudo: string;
        quantidadeVts: number;
        userId: number;
        tipoRelatoId: number;
    })[]>;
    findAllCategories(): Promise<{
        id: number;
        nome: string;
        descricao: string | null;
    }[]>;
}
