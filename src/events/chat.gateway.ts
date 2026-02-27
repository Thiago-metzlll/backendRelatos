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
import * as admin from 'firebase-admin';

export interface ChatMessage {
  userId: number;
  userName: string;
  text: string;
  createdAt: string;
}

@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: process.env.CORS_ORIGINS?.split(',') || [
      'http://localhost:5173',
      'https://front-relatos-two.vercel.app',
      'https://front-relatos-2fw7.vercel.app',
      'https://front-relatos-2fw7-iila76x4c-thiagos-projects-1de5c76e.vercel.app',
    ],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('ChatGateway');

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
      this.logger.log(`[chat] Conectado: ${payload.email} (${client.id})`);

      // Notifica outros usuários que alguém entrou
      client.broadcast.emit('user-joined', {
        userName: payload.name || payload.email,
        userId: payload.sub,
      });
    } catch (err) {
      this.logger.warn(`[chat] Rejeitado ${client.id}: ${err.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const user = client.data.user;
    if (user) {
      this.server.emit('user-left', {
        userName: user.name || user.email,
        userId: user.sub,
      });
    }
    this.logger.log(`[chat] Desconectado: ${client.id}`);
  }

  /**
   * Frontend emite 'chat-message' com o texto da mensagem.
   * O gateway persiste no Firestore e faz broadcast para todos.
   */
  @SubscribeMessage('chat-message')
  async handleChatMessage(
    @MessageBody() text: string,
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user;
    if (!user) {
      client.disconnect();
      return;
    }

    const message: ChatMessage = {
      userId: user.sub,
      userName: user.name || user.email,
      text: String(text).trim(),
      createdAt: new Date().toISOString(),
    };

    if (!message.text) return;

    try {
      // Persiste a mensagem no Firestore (coleção 'chat-global')
      await admin.firestore().collection('chat-global').add(message);
    } catch (err) {
      this.logger.error(
        '[chat] Erro ao salvar mensagem no Firestore:',
        err.message,
      );
    }

    // Broadcast para todos os clientes conectados ao namespace /chat
    this.server.emit('chat-message', message);
    this.logger.log(
      `[chat] Mensagem de ${message.userName}: "${message.text}"`,
    );
  }

  /**
   * Frontend pode chamar 'get-history' para buscar as últimas mensagens do chat.
   */
  @SubscribeMessage('get-history')
  async handleGetHistory(@ConnectedSocket() client: Socket) {
    try {
      const snapshot = await admin
        .firestore()
        .collection('chat-global')
        .orderBy('createdAt', 'desc')
        .limit(50)
        .get();

      const messages = snapshot.docs
        .map((doc) => doc.data() as ChatMessage)
        .reverse(); // do mais antigo para o mais novo

      client.emit('chat-history', messages);
    } catch (err) {
      this.logger.error('[chat] Erro ao buscar histórico:', err.message);
      client.emit('chat-history', []);
    }
  }
}
