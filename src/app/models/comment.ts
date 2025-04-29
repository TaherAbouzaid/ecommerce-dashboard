import { Timestamp } from 'firebase/firestore';
export interface Comment {
    commentId: string;
    postId: string;
    userId: string;
    content: string;
    likesCount: number;
    replyIds: string[];
    createdAt: Timestamp;
    updatedAt: Timestamp;
  }