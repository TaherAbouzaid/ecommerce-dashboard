import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../app/models/post';
import { FirebaseService } from './firebase.service';
@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private firebaseService: FirebaseService) {}
  
  getAllPosts(): Observable<Post[]> {
    return this.firebaseService.getAllPosts();
    
    
  }
  
  getPostById(postId: string): Observable<Post | null> {
    return this.firebaseService.getPostById(postId);
  }
  
  getPostsByUser(userId: string): Observable<Post[]> {
    return this.firebaseService.getPostsByUser(userId);
  }
  
  createPost(post: Omit<Post, 'postId' | 'createdAt' | 'updatedAt'>): Observable<Post> {
    return this.firebaseService.createPost(post);
  }
  
  updatePost(postId: string, updates: Partial<Post>): Observable<void> {
    return this.firebaseService.updatePost(postId, updates);
  }
  
  deletePost(postId: string): Observable<void> {
    return this.firebaseService.deletePost(postId);
  }
  
  incrementPostViews(postId: string): Observable<void> {
    return this.firebaseService.incrementPostViews(postId);
  }
}
