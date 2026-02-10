import { Controller, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Patch('profile')
    updateProfile(@Req() req: any, @Body() data: { avatarUrl?: string; nome?: string }) {
        return this.usersService.update(req.user.id, data);
    }
}
