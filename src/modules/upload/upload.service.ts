import { Injectable } from '@nestjs/common';
import { v2 } from 'cloudinary';
import * as fs from 'fs';

@Injectable()
export class UploadService {
  async uploadImage(file: Express.Multer.File) {
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
}
