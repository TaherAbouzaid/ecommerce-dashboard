import { Component, OnInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
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
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-list',
  standalone: true,
  templateUrl: './post-list.component.html',
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    FormsModule
  ]
})
export class PostListComponent implements OnInit {
  postsWithCommentsAndReplies: {
    post: Post;
    comments: {
      comment: Comment;
      replies: Reply[];
    }[];
    isEditing: boolean;
    editData: {
      title: string;
      content: string;
    };
  }[] = [];

  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(
    private postService: PostService,
    private commentService: CommentService,
    private replyService: ReplyService
  ) { }

  ngOnInit(): void {
    this.loadPostsWithCommentsAndReplies();
  }

  private loadPostsWithCommentsAndReplies(): void {
    this.postService.getAllPosts().pipe(
      switchMap(posts => {
        const postObservables = posts.map(post =>
          this.commentService.getCommentsByPostId(post.postId).pipe(
            switchMap(comments => {
              if (comments.length === 0) {
                return of({
                  post,
                  comments: [],
                  isEditing: false,
                  editData: {
                    title: post.title,
                    content: post.content
                  }
                });
              }
  
              const commentObservables = comments.map(comment =>
                this.replyService.getRepliesByCommentId(comment.commentId).pipe(
                  map(replies => ({
                    comment,
                    replies: replies || []
                  }))
                )
              );
  
              return forkJoin(commentObservables).pipe(
                map(commentsWithReplies => ({
                  post,
                  comments: commentsWithReplies,
                  isEditing: false,
                  editData: {
                    title: post.title,
                    content: post.content
                  }
                }))
              );
            })
          )
        );
        return postObservables.length > 0 ? forkJoin(postObservables) : of([]);
      })
    ).subscribe({
      next: postsWithCommentsAndReplies => {
        this.postsWithCommentsAndReplies = postsWithCommentsAndReplies;
        this.isLoading = false;
      },
      error: error => {
        console.error('❌ Error loading posts:', error);
        this.errorMessage = 'حدث خطأ أثناء تحميل البوستات.';
        this.isLoading = false;
      }
    });
  }
  


  toggleEdit(postIndex: number): void {
    const post = this.postsWithCommentsAndReplies[postIndex];
    post.isEditing = !post.isEditing;
    if (!post.isEditing) {
      post.editData = {
        title: post.post.title,
        content: post.post.content
      };
    }
  }

  updatePost(postIndex: number): void {
    const post = this.postsWithCommentsAndReplies[postIndex];
    const updates = {
      title: post.editData.title,
      content: post.editData.content
    };

    this.postService.updatePost(post.post.postId, updates).subscribe({
      next: () => {
        post.post.title = updates.title;
        post.post.content = updates.content;
        post.isEditing = false;
      },
      error: err => console.error('Error updating post:', err)
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
//post-list.component.ts