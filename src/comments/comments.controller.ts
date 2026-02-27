import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(
    private commentsService: CommentsService,
    private prisma: PrismaService,
  ) {}

  @Get()
  async getComments(@Param('postId') postId: string) {
    return this.commentsService.getCommentsByPost(parseInt(postId));
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createComment(
    @Param('postId') postId: string,
    @Body('texto') texto: string,
    @Request() req: any,
  ) {
    const userId = req.user.id;

    // Buscar o nome do usuário para salvar no Firestore (desnormalização)
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { nome: true },
    });

    return this.commentsService.createComment({
      postId: parseInt(postId),
      userId,
      userName: user?.nome || 'Usuário',
      texto,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteComment(@Param('id') commentId: string, @Request() req: any) {
    const userId = req.user.id;
    return this.commentsService.deleteComment(commentId, userId);
  }
}
