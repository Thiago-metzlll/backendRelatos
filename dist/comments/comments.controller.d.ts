import { CommentsService } from './comments.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class CommentsController {
    private commentsService;
    private prisma;
    constructor(commentsService: CommentsService, prisma: PrismaService);
    getComments(postId: string): Promise<{
        id: string;
    }[]>;
    createComment(postId: string, texto: string, req: any): Promise<{
        id: string;
    }>;
    deleteComment(commentId: string, req: any): Promise<{
        success: boolean;
    }>;
}
