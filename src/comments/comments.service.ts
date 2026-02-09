import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class CommentsService implements OnModuleInit {
    private db: admin.firestore.Firestore;

    onModuleInit() {
        // Nota: Em produção, estas credenciais devem vir de variáveis de ambiente ou arquivo JSON
        let credentialsPath = process.env.FIREBASE_CREDENTIALS_PATH;
        if (!admin.apps.length && credentialsPath) {
            try {
                // Usar path.resolve para garantir que o caminho esteja correto independente de onde o processo iniciou
                const resolvedPath = require('path').resolve(credentialsPath);
                admin.initializeApp({
                    credential: admin.credential.cert(resolvedPath),
                });
                console.log('✅ Firebase Admin SDK inicializado');
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

    async createComment(data: { postId: number; userId: number; userName: string; texto: string }) {
        try {
            const docRef = await this.db.collection('comentarios').add({
                ...data,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            const doc = await docRef.get();
            return { id: doc.id, ...doc.data() };
        } catch (error) {
            console.error('❌ Erro ao criar comentário no Firestore:', error);
            throw error;
        }
    }

    async getCommentsByPost(postId: number) {
        if (!this.db) {
            console.error('❌ Firestore não foi inicializado. Verifique as credenciais no .env');
            throw new Error('Firestore não inicializado');
        }

        console.log(`🔍 Buscando comentários para o postId: ${postId} (tipo: ${typeof postId})`);

        try {
            // Tivemos que comentar de novo porque o erro 500 voltou. 
            // Precisamos ver o log do backend para entender o motivo se o índice já está como "Ativo".
            const snapshot = await this.db
                .collection('comentarios')
                .where('postId', '==', postId)
                // .orderBy('createdAt', 'desc')
                .get();

            console.log(`✅ Consulta realizada. Documentos encontrados: ${snapshot.size}`);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
