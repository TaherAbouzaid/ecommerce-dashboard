
import { Timestamp } from 'firebase/firestore';

export interface Reply {
    replyId: string;
    commentId: string;
    userId: string;
    content: string;
    likesCount: number;
    createdAt: Timestamp;
    updatedAt: Timestamp;
  }
  