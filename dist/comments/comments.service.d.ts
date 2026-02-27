import { OnModuleInit } from '@nestjs/common';
import { CommentsGateway } from '../events/comments.gateway';
export declare class CommentsService implements OnModuleInit {
    private readonly commentsGateway;
    private db;
    constructor(commentsGateway: CommentsGateway);
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
