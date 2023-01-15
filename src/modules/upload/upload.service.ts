import { UploadRepository } from './../../models/repositories';
import { httpErrors } from './../../shares/exceptions/index';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 } from 'cloudinary';
import * as fs from 'fs';
import { CreateUploadDto } from './dto/create-upload.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(UploadRepository)
    private readonly uploadRepository: UploadRepository,
  ) {}

  async uploadImage(
    file: Express.Multer.File,
  ): Promise<Partial<CreateUploadDto>> {
    try {
      const data: Partial<UploadApiResponse> = await this.uploadImageCloudinary(
        file,
      );
      return {
        url: data.secure_url,
        public_id: data.public_id,
        file: data.resource_type,
        fileType: data.format,
      };
    } catch (error) {
      throw new HttpException(
        httpErrors.UPLOAD_IMAGE_FAILED,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async uploadImages(
    files: Array<Express.Multer.File>,
  ): Promise<Partial<CreateUploadDto>[]> {
    try {
      const images = [];
      for (const file of files) {
        const data: Partial<UploadApiResponse> =
          await this.uploadImageCloudinary(file);
        images.push({
          url: data.secure_url,
          public_id: data.public_id,
          file: data.resource_type,
          fileType: data.format,
        });
      }
      return images;
    } catch (error) {
      throw new HttpException(
        httpErrors.UPLOAD_IMAGE_FAILED,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteImage(public_id: string): Promise<{ result: string }> {
    try {
      const data: Partial<UploadApiResponse> = await this.deleteImageCloudinary(
        public_id,
      );
      console.log(data);
      return { result: data.result };
    } catch (error) {
      throw new HttpException(
        httpErrors.UPLOAD_IMAGE_FAILED,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async uploadImageCloudinary(file: Express.Multer.File) {
    return new Promise((resolve, reject) => {
      v2.uploader.upload(
        file.path,
        {
          folder: 'winter-social-network',
          width: 900,
          height: 900,
          crop: 'fill',
        },
        (error, result) => {
          this.removeTmp(file.path);
          if (error) return reject(error);
          resolve(result);
        },
      );
    });
  }

  removeTmp(path) {
    fs.unlink(path, (err) => {
      if (err) throw err;
    });
  }

  async deleteImageCloudinary(public_id: string) {
    return new Promise((resolve, reject) => {
      v2.uploader.destroy(public_id, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }

  async createUpload(createUpload: CreateUploadDto) {
    if (createUpload.public_id) {
      const upload = await this.uploadRepository.findOne({
        where: { public_id: createUpload.public_id },
      });
      if (upload) {
        throw new HttpException(
          httpErrors.UPLOAD_IMAGE_EXISTED,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    return await this.uploadRepository.save(createUpload);
  }
}
