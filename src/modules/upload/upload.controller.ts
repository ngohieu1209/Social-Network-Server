import { UploadService } from './upload.service';
import { httpErrors } from './../../shares/exceptions/index';
import {
  Controller,
  HttpException,
  HttpStatus,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(
    FileInterceptor('image', {
      dest: './tmp',
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(null, true);
        } else {
          cb(null, false);
        }
      },
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
    }),
  )
  async uploadAvatar(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // new FileTypeValidator({ fileType: /\/(jpg|jpeg|png|gif)$/ }),
          // new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
        ],
        exceptionFactory(errors) {
          throw new HttpException(
            httpErrors.WRONG_FILE_FORMAT,
            HttpStatus.BAD_REQUEST,
          );
        },
      }),
    )
    file: Express.Multer.File,
  ): Promise<{ url: string }> {
    return this.uploadService.uploadImage(file);
  }
}
