import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    console.log('--- Iniciando Seed SQL (Supabase) ---');

    // 1. Criar Tipos de Relatos
    const t1 = await prisma.tipoRelato.create({
        data: { nome: 'Tecnologia', descricao: 'Relatos sobre o mundo tech' },
    });
    const t2 = await prisma.tipoRelato.create({
        data: { nome: 'Dúvidas', descricao: 'Perguntas e pedidos de ajuda' },
    });
    const t3 = await prisma.tipoRelato.create({
        data: { nome: 'Experiência Pessoal', descricao: 'Histórias de vida' },
    });

    // 2. Criar Usuários
    const hashedPassword = await bcrypt.hash('senha123', 10);
    const u1 = await prisma.user.create({
        data: { nome: 'Thiago', email: 'thiago@exemplo.com', senha: hashedPassword },
    });
    const u2 = await prisma.user.create({
        data: { nome: 'Maria', email: 'maria@exemplo.com', senha: hashedPassword },
    });

    // 3. Criar Posts
    const p1 = await prisma.post.create({
        data: {
            conteudo: 'Acabei de configurar meu primeiro projeto NestJS com Prisma!',
            userId: u1.id,
            tipoRelatoId: t1.id,
            quantidadeVts: 5,
        },
    });

    const p2 = await prisma.post.create({
        data: {
            conteudo: 'Como vocês estruturam a parte de comentários em NoSQL?',
            userId: u2.id,
            tipoRelatoId: t2.id,
            quantidadeVts: 2,
        },
    });

    // 4. Criar Votos
    await prisma.voto.create({
        data: { userId: u2.id, postId: p1.id },
    });

    console.log('--- Iniciando Seed NoSQL (Firebase) ---');

    const credentialsPath = process.env.FIREBASE_CREDENTIALS_PATH;
    if (credentialsPath) {
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(path.resolve(credentialsPath)),
            });
        }
        const db = admin.firestore();

        const comments = [
            { postId: p1.id, userId: u2.id, texto: 'Parabéns pelo projeto!', createdAt: admin.firestore.FieldValue.serverTimestamp() },
            { postId: p1.id, userId: u1.id, texto: 'Obrigado, Maria!', createdAt: admin.firestore.FieldValue.serverTimestamp() },
            { postId: p2.id, userId: u1.id, texto: 'Eu gosto de usar Firebase para isso pela flexibilidade.', createdAt: admin.firestore.FieldValue.serverTimestamp() },
        ];

        for (const comment of comments) {
            await db.collection('comentarios').add(comment);
        }
    }

    console.log('Seed finalizado com sucesso!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
