import 'cloudinary';

declare module 'cloudinary' {
    export interface UploadApiOptions {
        file?: string | Buffer;
    }
}
