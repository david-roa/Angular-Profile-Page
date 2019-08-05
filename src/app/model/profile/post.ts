import { Comment } from './comment';
import { Attached } from './atteched';
import { Image } from './image';

export class Post {
    date: Date;
    imgProfile: string;
    text: string;
    user: string;
    comments: Comment[];
    images: Image[];
    attachments: Attached[]

    constructor() {
        this.date = new Date();
        this.comments = [];
        this.images = [];
        this.attachments = [];
    }
}