import { Injectable, StreamableFile } from '@nestjs/common';
import * as fs from 'fs';
import { createReadStream } from 'fs';

@Injectable()
export class FileSystemService {

    fileExists(path: string) {
        return fs.existsSync(path);
    }

    createFile(file: Express.Multer.File, dirPath?: string) {
        if (dirPath && !this.fileExists(dirPath))
            fs.mkdirSync(dirPath, { recursive: true });
        fs.appendFileSync(`${dirPath ?? ''}/${file.originalname}`, file.buffer);
    }

    deleteFile(path: string) {
        if (!this.fileExists(path))
            throw new Error(`There is no file at ${path}`);
        fs.unlinkSync(path);
    }

    fetchFile(path: string, fileName: string) {
        const fullPath = `${path}/${fileName}`;
        console.log(fullPath);
        if (!this.fileExists(fullPath))
            throw new Error(`There is no file at ${fullPath}`);
        const file = createReadStream(fullPath);
        return new StreamableFile(file);
    }

}
