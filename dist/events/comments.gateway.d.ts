import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
export declare class CommentsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly jwtService;
    server: Server;
    private logger;
    constructor(jwtService: JwtService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleJoinPost(postId: number, client: Socket): {
        event: string;
        room: string;
    };
    handleLeavePost(postId: number, client: Socket): {
        event: string;
        room: string;
    };
    emitNewComment(postId: number, comment: any): void;
}
