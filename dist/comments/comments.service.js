"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const admin = __importStar(require("firebase-admin"));
let CommentsService = class CommentsService {
    db;
    onModuleInit() {
        const credentialsPath = process.env.FIREBASE_CREDENTIALS_PATH;
        const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
        if (!admin.apps.length) {
            try {
                if (serviceAccountJson) {
                    admin.initializeApp({
                        credential: admin.credential.cert(JSON.parse(serviceAccountJson)),
                    });
                    console.log('✅ Firebase Admin SDK inicializado via FIREBASE_SERVICE_ACCOUNT');
                }
                else if (credentialsPath) {
                    const resolvedPath = require('path').resolve(credentialsPath);
                    admin.initializeApp({
                        credential: admin.credential.cert(resolvedPath),
                    });
                    console.log('✅ Firebase Admin SDK inicializado via FIREBASE_CREDENTIALS_PATH');
                }
                else {
                    console.warn('⚠️ Nenhuma credencial do Firebase encontrada (FIREBASE_SERVICE_ACCOUNT ou FIREBASE_CREDENTIALS_PATH)');
                }
            }
            catch (error) {
                console.error('❌ Erro ao inicializar Firebase Admin SDK:', error);
            }
        }
        try {
            this.db = admin.firestore();
            console.log('✅ Firebase (Firestore) conectado com sucesso!');
        }
        catch (error) {
            console.error('❌ Erro ao conectar ao Firestore:', error);
        }
    }
    async createComment(data) {
        try {
            const docRef = await this.db.collection('comentarios').add({
                ...data,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            const doc = await docRef.get();
            return { id: doc.id, ...doc.data() };
        }
        catch (error) {
            console.error('❌ Erro ao criar comentário no Firestore:', error);
            throw error;
        }
    }
    async getCommentsByPost(postId) {
        if (!this.db) {
            console.error('❌ Firestore não foi inicializado. Verifique as credenciais no .env');
            throw new Error('Firestore não inicializado');
        }
        console.log(`🔍 Buscando comentários para o postId: ${postId} (tipo: ${typeof postId})`);
        try {
            const snapshot = await this.db
                .collection('comentarios')
                .where('postId', '==', postId)
                .get();
            console.log(`✅ Consulta realizada. Documentos encontrados: ${snapshot.size}`);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
        catch (error) {
            console.error('❌ Erro detalhado ao buscar comentários:', error);
            throw error;
        }
    }
    async deleteComment(commentId, userId) {
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
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)()
], CommentsService);
//# sourceMappingURL=comments.service.js.map