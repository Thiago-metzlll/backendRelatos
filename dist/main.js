"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const origins = process.env.CORS_ORIGINS
        ? process.env.CORS_ORIGINS.split(',')
        : [
            'http://localhost:5173',
            'https://front-relatos-two.vercel.app',
            'https://front-relatos-2fw7.vercel.app',
            'https://front-relatos-2fw7-iila76x4c-thiagos-projects-1de5c76e.vercel.app',
        ];
    app.enableCors({
        origin: origins,
        credentials: true,
    });
    app.use((0, cookie_parser_1.default)());
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map