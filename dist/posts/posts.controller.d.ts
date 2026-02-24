import { PostsService } from './posts.service';
import { CreatePostDto } from './posts.dto';
export declare class PostsController {
    private postsService;
    constructor(postsService: PostsService);
    findAll(tipoRelatoId?: string): Promise<any>;
    getMyPosts(req: any): Promise<any>;
    findAllCategories(): Promise<any>;
    create(createPostDto: CreatePostDto, req: any): Promise<any>;
    vote(id: string, req: any): Promise<any>;
    createFromTelegram(body: CreatePostDto, apiKey: string): Promise<any>;
}
