import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { CommentService } from './comment.service';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getCommentsByPostId(
    @Query('postId') postId: string,
    @Query('page') page: number,
  ) {
    return this.commentService.getCommentsByPostId(postId, page);
  }
}
