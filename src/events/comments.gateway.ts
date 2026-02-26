import {
    WebSocketGateway,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';
import * as cookie from 'cookie';

@WebSocketGateway({
    namespace: '/comments',
    cors: {
        origin: [
            'http://localhost:5173',
            'https://front-relatos-two.vercel.app',
        ],
        credentials: true,
    },
})
export class CommentsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private logger = new Logger('CommentsGateway');

    constructor(private readonly jwtService: JwtService) { }

    async handleConnection(client: Socket) {
        try {
            const cookies = client.handshake.headers.cookie;
            if (!cookies) throw new Error('Sem cookies');

            const parsed = cookie.parse(cookies);
            const token = parsed.access_token;
            if (!token) throw new Error('Token não encontrado');

            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET || 'super-secret',
            });

            client.data.user = payload;
            this.logger.log(`[comments] Conectado: ${payload.email} (${client.id})`);
        } catch (err) {
            this.logger.warn(`[comments] Rejeitado ${client.id}: ${err.message}`);
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`[comments] Desconectado: ${client.id}`);
    }

    /**
     * O frontend emite 'join-post' com o postId para entrar no room
     * e receber notificações de novos comentários daquele post.
     */
    @SubscribeMessage('join-post')
    handleJoinPost(
        @MessageBody() postId: number,
        @ConnectedSocket() client: Socket,
    ) {
        const room = `post-${postId}`;
        client.join(room);
        this.logger.log(`[comments] ${client.data.user?.email} entrou no room ${room}`);
        return { event: 'joined', room };
    }

    /**
     * O frontend emite 'leave-post' para sair do room ao fechar o post.
     */
    @SubscribeMessage('leave-post')
    handleLeavePost(
        @MessageBody() postId: number,
        @ConnectedSocket() client: Socket,
    ) {
        const room = `post-${postId}`;
        client.leave(room);
        this.logger.log(`[comments] ${client.data.user?.email} saiu do room ${room}`);
        return { event: 'left', room };
    }

    /**
     * Chamado pelo CommentsService após salvar o comentário no Firestore.
     * Emite o novo comentário para todos os clientes no room do post.
     */
    emitNewComment(postId: number, comment: any) {
        const room = `post-${postId}`;
        this.server.to(room).emit('new-comment', comment);
        this.logger.log(`[comments] Emitido 'new-comment' para o room ${room}`);
    }
}
