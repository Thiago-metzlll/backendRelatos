import { OnModuleInit } from '@nestjs/common';
export declare class CommentsService implements OnModuleInit {
    private db;
    onModuleInit(): void;
    createComment(data: {
        postId: number;
        userId: number;
        userName: string;
        texto: string;
    }): Promise<{
        id: string;
    }>;
    getCommentsByPost(postId: number): Promise<{
        id: string;
    }[]>;
    deleteComment(commentId: string, userId: number): Promise<{
        success: boolean;
    }>;
}
