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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const common_1 = require("@nestjs/common");
const cookie = __importStar(require("cookie"));
let CommentsGateway = class CommentsGateway {
    jwtService;
    server;
    logger = new common_1.Logger('CommentsGateway');
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async handleConnection(client) {
        try {
            const cookies = client.handshake.headers.cookie;
            if (!cookies)
                throw new Error('Sem cookies');
            const parsed = cookie.parse(cookies);
            const token = parsed.access_token;
            if (!token)
                throw new Error('Token não encontrado');
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET || 'super-secret',
            });
            client.data.user = payload;
            this.logger.log(`[comments] Conectado: ${payload.email} (${client.id})`);
        }
        catch (err) {
            this.logger.warn(`[comments] Rejeitado ${client.id}: ${err.message}`);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        this.logger.log(`[comments] Desconectado: ${client.id}`);
    }
    handleJoinPost(postId, client) {
        const room = `post-${postId}`;
        client.join(room);
        this.logger.log(`[comments] ${client.data.user?.email} entrou no room ${room}`);
        return { event: 'joined', room };
    }
    handleLeavePost(postId, client) {
        const room = `post-${postId}`;
        client.leave(room);
        this.logger.log(`[comments] ${client.data.user?.email} saiu do room ${room}`);
        return { event: 'left', room };
    }
    emitNewComment(postId, comment) {
        const room = `post-${postId}`;
        this.server.to(room).emit('new-comment', comment);
        this.logger.log(`[comments] Emitido 'new-comment' para o room ${room}`);
    }
};
exports.CommentsGateway = CommentsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], CommentsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join-post'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], CommentsGateway.prototype, "handleJoinPost", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave-post'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], CommentsGateway.prototype, "handleLeavePost", null);
exports.CommentsGateway = CommentsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: '/comments',
        cors: {
            origin: process.env.CORS_ORIGINS?.split(',') || [
                'http://localhost:5173',
                'https://front-relatos-two.vercel.app',
                'https://front-relatos-2fw7.vercel.app',
                'https://front-relatos-2fw7-iila76x4c-thiagos-projects-1de5c76e.vercel.app',
            ],
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], CommentsGateway);
//# sourceMappingURL=comments.gateway.js.map