import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Timestamp } from 'firebase/firestore';

import {
  Auth,
  createUserWithEmailAndPassword,
  UserCredential
} from '@angular/fire/auth';

import {
  Firestore,
  doc,
  setDoc
} from '@angular/fire/firestore';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      role: ['', Validators.required]
    }, { validator: this.passwordsMatchValidator });
  }

  get f() {
    return this.registerForm.controls;
  }

  passwordsMatchValidator(form: FormGroup) {
    const pass = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  async onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) return;

    this.loading = true;
    const { name, email, password, role } = this.registerForm.value;

    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const uid = userCredential.user.uid;

      const userData = {
        userId: uid,
        name,
        email,
        profileimage: '',
        phone: '',
        role,
        wishlist: [],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      await setDoc(doc(this.firestore, 'Users', uid), userData);

      // Redirect
      if (role === 'Shop manager') {
        this.router.navigate(['/seller/dashboard']);
      } else if (role === 'Main admin') {
        this.router.navigate(['/seller/dashboard']);
      }
      else {
        this.router.navigate(['/buyer/home']);
      }

    } catch (error) {
      console.error('Error during registration:', error);
      //  ممكن تعرض رسالة للمستخدم هنا يابا
    }

    this.loading = false;
  }
}
