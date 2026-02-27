import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async createPost(userId: number, data: any) {
    return this.prisma.post.create({
      data: {
        conteudo: data.conteudo,
        userId: userId,
        tipoRelatoId: data.tipoRelatoId,
      },
      include: {
        tipoRelato: true,
        user: { select: { nome: true } },
      },
    });
  }

  async findAll(tipoRelatoId?: number) {
    return this.prisma.post.findMany({
      where: tipoRelatoId ? { tipoRelatoId } : {},
      orderBy: { quantidadeVts: 'desc' },
      include: {
        tipoRelato: true,
        user: { select: { nome: true } },
      },
    });
  }

  async upvote(userId: number, postId: number) {
    // Check if already voted
    const existingVoto = await this.prisma.voto.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });

    if (existingVoto) {
      // Remover voto (toggle)
      return this.prisma.$transaction(async (tx) => {
        await tx.voto.delete({ where: { id: existingVoto.id } });
        return tx.post.update({
          where: { id: postId },
          data: { quantidadeVts: { decrement: 1 } },
        });
      });
    }

    // Adicionar voto
    return this.prisma.$transaction(async (tx) => {
      await tx.voto.create({ data: { userId, postId } });
      return tx.post.update({
        where: { id: postId },
        data: { quantidadeVts: { increment: 1 } },
      });
    });
  }

  async findByUser(userId: number) {
    return this.prisma.post.findMany({
      where: { userId },
      include: { tipoRelato: true, user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllCategories() {
    return this.prisma.tipoRelato.findMany();
  }
}
