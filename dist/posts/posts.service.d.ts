import { PrismaService } from '../prisma/prisma.service';
export declare class PostsService {
    private prisma;
    constructor(prisma: PrismaService);
    createPost(userId: number, data: any): Promise<any>;
    findAll(tipoRelatoId?: number): Promise<any>;
    upvote(userId: number, postId: number): Promise<any>;
    findByUser(userId: number): Promise<any>;
    findAllCategories(): Promise<any>;
}
