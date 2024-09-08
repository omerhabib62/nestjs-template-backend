import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
    imports: [
        MulterModule.registerAsync({
            useFactory: () => ({
                storage: diskStorage({
                    destination: './uploads', // Directory for saving uploaded files
                    filename: (req, file, callback) => {
                        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                        const ext = extname(file.originalname);
                        const fileName = `${uniqueSuffix}${ext}`;
                        callback(null, fileName);
                    },
                }),
                fileFilter: (req, file, callback) => {
                    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                        return callback(new Error('Only image files are allowed!'), false);
                    }
                    callback(null, true);
                },
            }),
        }),
    ],
    exports: [MulterModule]

})
export class ImagesModule { }
