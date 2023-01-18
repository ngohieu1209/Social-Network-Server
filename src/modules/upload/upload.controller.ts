import { UploadService } from './upload.service';
import { httpErrors } from './../../shares/exceptions/index';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUploadDto } from './dto/create-upload.dto';

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
  async uploadImage(
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
  ): Promise<Partial<CreateUploadDto>> {
    return this.uploadService.uploadImage(file);
  }

  @Post('images')
  @UseInterceptors(
    FilesInterceptor('images', 5, {
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
  async uploadImages(
    @UploadedFiles(
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
    files: Array<Express.Multer.File>,
  ): Promise<Partial<CreateUploadDto>[]> {
    return this.uploadService.uploadImages(files);
  }

  @Post('delete-image')
  async deleteImage(
    @Body('public_id') public_id: string,
  ): Promise<{ result: string }> {
    return this.uploadService.deleteImage(public_id);
  }

  @Post('create')
  createUpload(@Body() createUpload: CreateUploadDto) {
    return this.uploadService.createUpload(createUpload);
  }

  @Get('post/:postId')
  getPostUploads(@Param('postId') postId: string) {
    return this.uploadService.getPostUploads(postId);
  }
}
