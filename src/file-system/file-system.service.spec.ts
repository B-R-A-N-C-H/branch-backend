import { Test, TestingModule } from '@nestjs/testing';
import { FileSystemService } from './file-system.service';

describe('FileSystemService', () => {
    let service: FileSystemService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [FileSystemService],
        }).compile();

        service = module.get<FileSystemService>(FileSystemService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('fileExists', () => {
        it('should return false when a file or directory does not exist', async () => {
            expect(service.fileExists('/doesnt-exist')).toBe(false);
        });

        it('should return true when a file or directory exists', async () => {
            expect(service.fileExists('README.md')).toBe(true);
        });
    });
});
