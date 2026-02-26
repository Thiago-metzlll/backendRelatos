import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CommentsGateway } from './comments.gateway';
import { ChatGateway } from './chat.gateway';

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'super-secret',
            signOptions: { expiresIn: '7d' },
        }),
    ],
    providers: [CommentsGateway, ChatGateway],
    exports: [CommentsGateway], // Exportado para CommentsService poder injetá-lo
})
export class EventsModule { }
