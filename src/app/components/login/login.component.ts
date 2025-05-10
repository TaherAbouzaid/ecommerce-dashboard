import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Auth,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false],
    });
  }

  ngOnInit() {
    this.auth.onAuthStateChanged(async (user) => {
      if (user && this.router.url !== '/logout') {
        console.log('User detected, checking role');

        // تعليق التحقق من emailVerified للاختبار
        // if (!user.emailVerified) {
        //   console.log('Email not verified, signing out');
        //   this.errorMessage = 'يرجى التحقق من بريدك الإلكتروني أولاً';
        //   await this.auth.signOut();
        //   localStorage.removeItem('userUID');
        //   this.router.navigateByUrl('/login', { replaceUrl: true });
        //   return;
        // }

        const userRef = doc(this.firestore, `users/${user.uid}`);
        try {
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData: any = userSnap.data();
            const role = userData.role;
            console.log('User role:', role);

            if (
              role === 'admin' ||
              role === 'shop manager' ||
              role === 'vendor' ||
              role === 'Author'
            ) {
              localStorage.setItem('userUID', user.uid);
              this.router.navigateByUrl('/dashboard', { replaceUrl: true });
            } else {
              this.router.navigateByUrl('/unauthorized', { replaceUrl: true });
            }
          } else {
            console.error('No user data found in Firestore');
            this.errorMessage = 'لم يتم العثور على بيانات المستخدم';
            await this.auth.signOut();
            localStorage.removeItem('userUID');
            this.router.navigateByUrl('/login', { replaceUrl: true });
          }
        } catch (error) {
          console.error('Error checking user:', error);
          this.errorMessage = 'حدث خطأ أثناء التحقق من بيانات المستخدم';
          await this.auth.signOut();
          localStorage.removeItem('userUID');
          this.router.navigateByUrl('/login', { replaceUrl: true });
        }
      } else {
        console.log('No user detected, staying on login');
      }
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  private handleAuthError(error: any): string {
    switch (error.code) {
      case 'auth/wrong-password':
        return 'كلمة المرور غير صحيحة';
      case 'auth/user-not-found':
        return 'المستخدم غير موجود';
      case 'auth/invalid-email':
        return 'البريد الإلكتروني غير صالح';
      default:
        return 'فشل تسجيل الدخول. حاول مرة أخرى';
    }
  }

  async onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password, rememberMe } = this.loginForm.value;

    try {
      await setPersistence(
        this.auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );

      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      // تعليق التحقق من emailVerified للاختبار
      // if (!userCredential.user.emailVerified) {
      //   this.errorMessage = 'يرجى التحقق من بريدك الإلكتروني أولاً';
      //   await this.auth.signOut();
      //   localStorage.removeItem('userUID');
      //   this.router.navigateByUrl('/login', { replaceUrl: true });
      //   return;
      // }

      const uid = userCredential.user.uid;
      const userRef = doc(this.firestore, `users/${uid}`);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData: any = userSnap.data();
        const role = userData.role;
        localStorage.setItem('userUID', uid);

        console.log('User role:', role);

        if (
          role === 'admin' ||
          role === 'shop manager' ||
          role === 'vendor' ||
          role === 'Author'
        ) {
          this.router.navigateByUrl('/dashboard', { replaceUrl: true });
        } else {
          this.router.navigateByUrl('/unauthorized', { replaceUrl: true });
        }
      } else {
        this.errorMessage = '';
        console.error('No user data found in Firestore.');
        await this.auth.signOut();
        localStorage.removeItem('userUID');
        this.router.navigateByUrl('/login', { replaceUrl: true });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      this.errorMessage = this.handleAuthError(error);
    } finally {
      this.isLoading = false;
    }
  }
}
