import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './posts.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('posts')
export class PostsController {
    constructor(private postsService: PostsService) { }

    @Get()
    async findAll(@Query('tipoRelatoId') tipoRelatoId?: string) {
        return this.postsService.findAll(tipoRelatoId ? parseInt(tipoRelatoId) : undefined);
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
}
