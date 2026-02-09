"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PostsService = class PostsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createPost(userId, data) {
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
    async findAll(tipoRelatoId) {
        return this.prisma.post.findMany({
            where: tipoRelatoId ? { tipoRelatoId } : {},
            orderBy: { quantidadeVts: 'desc' },
            include: {
                tipoRelato: true,
                user: { select: { nome: true } },
            },
        });
    }
    async upvote(userId, postId) {
        const existingVoto = await this.prisma.voto.findUnique({
            where: {
                userId_postId: { userId, postId },
            },
        });
        if (existingVoto) {
            return this.prisma.$transaction(async (tx) => {
                await tx.voto.delete({ where: { id: existingVoto.id } });
                return tx.post.update({
                    where: { id: postId },
                    data: { quantidadeVts: { decrement: 1 } },
                });
            });
        }
        return this.prisma.$transaction(async (tx) => {
            await tx.voto.create({ data: { userId, postId } });
            return tx.post.update({
                where: { id: postId },
                data: { quantidadeVts: { increment: 1 } },
            });
        });
    }
    async findByUser(userId) {
        return this.prisma.post.findMany({
            where: { userId },
            include: { tipoRelato: true, user: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findAllCategories() {
        return this.prisma.tipoRelato.findMany();
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PostsService);
//# sourceMappingURL=posts.service.js.map