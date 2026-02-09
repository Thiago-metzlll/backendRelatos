import { PostsService } from './posts.service';
import { CreatePostDto } from './posts.dto';
export declare class PostsController {
    private postsService;
    constructor(postsService: PostsService);
    findAll(tipoRelatoId?: string): Promise<({
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
    getMyPosts(req: any): Promise<({
        user: {
            id: number;
            email: string;
            nome: string;
            senha: string;
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
    create(createPostDto: CreatePostDto, req: any): Promise<{
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
    vote(id: string, req: any): Promise<{
        id: number;
        createdAt: Date;
        conteudo: string;
        quantidadeVts: number;
        userId: number;
        tipoRelatoId: number;
    }>;
}
