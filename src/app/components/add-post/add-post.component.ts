import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { PostService } from '../../../services/post.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css'],
  imports:[CommonModule,ReactiveFormsModule]
})
export class AddPostComponent {
  postForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private router: Router
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      content: ['', [Validators.required, Validators.minLength(20)]]
    });
  }

  onSubmit() {
    if (this.postForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // في تطبيق حقيقي، يجب الحصول على authorId من خدمة المستخدم/المصادقة
    const authorId = 'sample_user_6'; // استبدل هذا بمعرف المستخدم الحقيقي

    const postData = {
      title: this.postForm.value.title,
      content: this.postForm.value.content,
      authorId: authorId,
      views: 0,
      likesCount: 0,
      commentIds: []
    };

    this.postService.createPost(postData).subscribe({
      next: (createdPost) => {
        this.isLoading = false;
        this.router.navigate(['/posts', createdPost.postId]); // توجيه إلى صفحة المنشور الجديد
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'حدث خطأ أثناء إنشاء المنشور. يرجى المحاولة مرة أخرى.';
        console.error('Error creating post:', error);
      }
    });
  }

  get title() {
    return this.postForm.get('title');
  }

  get content() {
    return this.postForm.get('content');
  }
}