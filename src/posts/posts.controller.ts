import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './posts.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) { }

  @Get()
  async findAll(@Query('tipoRelatoId') tipoRelatoId?: string) {
    return this.postsService.findAll(
      tipoRelatoId ? parseInt(tipoRelatoId) : undefined,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-posts')
  async getMyPosts(@Request() req: any) {
    return this.postsService.findByUser(req.user.id);
  }

  @Get('categories')
  async findAllCategories() {
    return this.postsService.findAllCategories();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createPostDto: CreatePostDto, @Request() req: any) {
    const userId = req.user.id;
    return this.postsService.createPost(userId, createPostDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/vote')
  async vote(@Param('id') id: string, @Request() req: any) {
    const userId = req.user.id;
    return this.postsService.upvote(userId, parseInt(id));
  }

  @Post('telegram')
  async createFromTelegram(
    @Body() body: CreatePostDto,
    @Headers('x-api-key') apiKey: string,
  ) {
    if (!apiKey || apiKey !== process.env.TELEGRAM_API_KEY) {
      throw new UnauthorizedException('Chave de API inválida');
    }
    const anonUserId = parseInt(process.env.ANON_USER_ID || '1');
    return this.postsService.createPost(anonUserId, body);
  }

  /**
   * Rota de integração para Activepieces (segundo bot).
   * Persiste relatos gerados ou diretos sob o usuário anônimo.
   */
  @Post('activepieces')
  async createFromActivepieces(
    @Body() body: CreatePostDto,
    @Headers('x-api-key') apiKey: string,
  ) {
    if (!apiKey || apiKey !== process.env.TELEGRAM_API_KEY) {
      throw new UnauthorizedException('Chave de API inválida');
    }
    const anonUserId = parseInt(process.env.ANON_USER_ID || '1');
    return this.postsService.createPost(anonUserId, body);
  }

  /**
   * Rota de webhook genérica para integração com serviços externos.
   * Persiste o conteúdo recebido como postagem de usuário anônimo.
   */
  @Post('webhook')
  async createFromWebhook(
    @Body() body: CreatePostDto,
    @Headers('x-api-key') apiKey: string,
  ) {
    if (!apiKey || apiKey !== process.env.TELEGRAM_API_KEY) {
      throw new UnauthorizedException('Chave de API inválida');
    }
    const anonUserId = parseInt(process.env.ANON_USER_ID || '1');
    return this.postsService.createPost(anonUserId, body);
  }
}
