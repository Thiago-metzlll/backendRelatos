import { Injectable, OnModuleInit, Optional } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { CommentsGateway } from '../events/comments.gateway';

@Injectable()
export class CommentsService implements OnModuleInit {
  private db: admin.firestore.Firestore;

  constructor(@Optional() private readonly commentsGateway: CommentsGateway) {}

  onModuleInit() {
    const credentialsPath = process.env.FIREBASE_CREDENTIALS_PATH;
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;

    if (!admin.apps.length) {
      try {
        if (serviceAccountJson) {
          // Inicialização via JSON string (ideal para Vercel/Render/Railway)
          admin.initializeApp({
            credential: admin.credential.cert(JSON.parse(serviceAccountJson)),
          });
          console.log(
            '✅ Firebase Admin SDK inicializado via FIREBASE_SERVICE_ACCOUNT',
          );
        } else if (credentialsPath) {
          // Inicialização via arquivo (ideal para desenvolvimento local)
          const resolvedPath = require('path').resolve(credentialsPath);
          admin.initializeApp({
            credential: admin.credential.cert(resolvedPath),
          });
          console.log(
            '✅ Firebase Admin SDK inicializado via FIREBASE_CREDENTIALS_PATH',
          );
        } else {
          console.warn(
            '⚠️ Nenhuma credencial do Firebase encontrada (FIREBASE_SERVICE_ACCOUNT ou FIREBASE_CREDENTIALS_PATH)',
          );
        }
      } catch (error) {
        console.error('❌ Erro ao inicializar Firebase Admin SDK:', error);
      }
    }

    try {
      this.db = admin.firestore();
      console.log('✅ Firebase (Firestore) conectado com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao conectar ao Firestore:', error);
    }
  }

  async createComment(data: {
    postId: number;
    userId: number;
    userName: string;
    texto: string;
  }) {
    try {
      const docRef = await this.db.collection('comentarios').add({
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      const doc = await docRef.get();
      const saved = { id: doc.id, ...doc.data() };

      // Emite o novo comentário via WebSocket para todos os clientes do post
      if (this.commentsGateway) {
        this.commentsGateway.emitNewComment(data.postId, saved);
      }

      return saved;
    } catch (error) {
      console.error('❌ Erro ao criar comentário no Firestore:', error);
      throw error;
    }
  }

  async getCommentsByPost(postId: number) {
    if (!this.db) {
      console.error(
        '❌ Firestore não foi inicializado. Verifique as credenciais no .env',
      );
      throw new Error('Firestore não inicializado');
    }

    console.log(
      `🔍 Buscando comentários para o postId: ${postId} (tipo: ${typeof postId})`,
    );

    try {
      // Tivemos que comentar de novo porque o erro 500 voltou.
      // Precisamos ver o log do backend para entender o motivo se o índice já está como "Ativo".
      const snapshot = await this.db
        .collection('comentarios')
        .where('postId', '==', postId)
        // .orderBy('createdAt', 'desc')
        .get();

      console.log(
        `✅ Consulta realizada. Documentos encontrados: ${snapshot.size}`,
      );
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('❌ Erro detalhado ao buscar comentários:', error);
      throw error;
    }
  }

  async deleteComment(commentId: string, userId: number) {
    const docRef = this.db.collection('comentarios').doc(commentId);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new Error('Comentário não encontrado');
    }

    const commentData = doc.data();
    if (commentData?.userId !== userId) {
      throw new Error('Sem permissão para deletar este comentário');
    }

    await docRef.delete();
    return { success: true };
  }
}
