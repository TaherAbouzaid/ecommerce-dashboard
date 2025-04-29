import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Post } from '../../models/post';
import { Comment } from '../../models/comment';
import { Reply } from '../../models/replay';
import { PostService } from '../../../services/post.service';
import { CommentService } from '../../../services/comment.service';
import { ReplyService } from '../../../services/reply.service';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-post-list',
  standalone: true,
  templateUrl: './post-list.component.html',
  imports: [
    CommonModule,
    CardModule,
    ButtonModule
  ]
})
export class PostListComponent implements OnInit {
  postsWithCommentsAndReplies: {
    post: Post,
    comments: {
      comment: Comment,
      replies: Reply[]
    }[]
  }[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(
    private postService: PostService,
    private commentService: CommentService,
    private replyService: ReplyService
  ) {}

  ngOnInit(): void {
    this.loadPostsWithCommentsAndReplies();
  }

  private loadPostsWithCommentsAndReplies(): void {
    this.postService.getAllPosts().pipe(
      switchMap(posts => {
        const postObservables = posts.map(post =>
          this.commentService.getCommentsByPostId(post.postId).pipe(
            switchMap(comments => {
              const commentObservables = comments.map(comment =>
                this.replyService.getRepliesByCommentId(comment.commentId).pipe(
                  map(replies => ({ comment, replies }))
                )
              );
              return forkJoin(commentObservables).pipe(
                map(commentsWithReplies => ({ post, comments: commentsWithReplies }))
              );
            })
          )
        );
        return forkJoin(postObservables);
      })
    ).subscribe({
      next: postsWithCommentsAndReplies => {
        this.postsWithCommentsAndReplies = postsWithCommentsAndReplies;
        this.isLoading = false;
      },
      error: error => {
        console.error('Error loading posts:', error);
        this.errorMessage = 'Failed to load posts. Please try again later.';
        this.isLoading = false;
      }
    });
  }
  createPost(): void {
    const newPost: Omit<Post, 'postId' | 'createdAt' | 'updatedAt'> = {
      title: 'عنوان جديد',
      content: 'محتوى جديد',
      authorId: 'user_123',
      views: 0,
      likesCount: 0,
      commentIds: []
    };
  
    this.postService.createPost(newPost).subscribe({
      next: post => {
        console.log('Post created:', post);
        this.loadPostsWithCommentsAndReplies();
      },
      error: err => console.error('Error creating post:', err)
    });
  }
  
  updatePost(postId: string): void {
    const updates = { title: 'عنوان معدل', content: 'محتوى معدل' };
  
    this.postService.updatePost(postId, updates).subscribe({
      next: () => {
        console.log('Post updated');
        this.loadPostsWithCommentsAndReplies();
      },
      error: err => console.error('Error updating post:', err)
    });
  }
  
  deletePost(postId: string): void {
    this.postService.deletePost(postId).subscribe({
      next: () => {
        console.log('Post deleted');
        this.loadPostsWithCommentsAndReplies();
      },
      error: err => console.error('Error deleting post:', err)
    });
  }
  
}
