import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../../services/post.service';
import { CommentService } from '../../../services/comment.service';
import { ReplyService } from '../../../services/reply.service';
import { Post } from '../../models/post';
import { Comment } from '../../models/comment';
import { Reply } from '../../models/replay';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.css',
  standalone: true,
  imports: [CommonModule]
})
export class PostDetailsComponent implements OnInit {
  post: Post | null = null;
  commentsWithReplies: { comment: Comment; replies: Reply[] }[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private commentService: CommentService,
    private replyService: ReplyService
  ) {}

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('postId');
    if (postId) {
      this.loadPostDetails(postId);
    } else {
      this.errorMessage = 'No post ID provided.';
      this.isLoading = false;
    }
  }

  private loadPostDetails(postId: string): void {
    this.isLoading = true;
    this.postService.getPostById(postId).subscribe({
      next: (post) => {
        this.post = post;
        this.loadCommentsAndReplies(postId);
      },
      error: (err) => {
        this.errorMessage = 'Error loading post.';
        this.isLoading = false;
      }
    });
  }

  private loadCommentsAndReplies(postId: string): void {
    this.commentService.getCommentsByPostId(postId).subscribe({
      next: (comments) => {
        if (!comments.length) {
          this.commentsWithReplies = [];
          this.isLoading = false;
          return;
        }
        let loaded = 0;
        this.commentsWithReplies = [];
        comments.forEach((comment, idx) => {
          this.replyService.getRepliesByCommentId(comment.commentId).subscribe({
            next: (replies) => {
              this.commentsWithReplies[idx] = { comment, replies: replies || [] };
              loaded++;
              if (loaded === comments.length) this.isLoading = false;
            },
            error: () => {
              this.commentsWithReplies[idx] = { comment, replies: [] };
              loaded++;
              if (loaded === comments.length) this.isLoading = false;
            }
          });
        });
      },
      error: () => {
        this.commentsWithReplies = [];
        this.isLoading = false;
      }
    });
  }
}
