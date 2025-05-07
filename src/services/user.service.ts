import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  updateDoc,
  addDoc,
  Timestamp,
  setDoc,
  getDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from '../app/models/user.model';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from '@angular/fire/storage';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  firestore = inject(Firestore);

  constructor(private storage: Storage, private auth: Auth) {}

  getUsers(): Observable<User[]> {
    const usersRef = collection(this.firestore, 'users');
    return collectionData(usersRef, { idField: 'userId' }) as Observable<
      User[]
    >;
  }
  getUserById(uid: string): Observable<User | undefined> {
    const userRef = doc(this.firestore, 'users', uid);
    const userDoc = getDoc(userRef);

    return new Observable((observer) => {
      userDoc
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            observer.next(docSnapshot.data() as User);
          } else {
            observer.next(undefined);
          }
        })
        .catch((error: any) => {
          console.error('Error getting document:', error);
          observer.error(error);
        });
    });
  }

  async uploadImage(file: File, userId: string): Promise<string> {
    const filePath = `users/${userId}_${file.name}`;
    const storageRef = ref(this.storage, filePath);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }

  async createUserByAdmin(
    email: string,
    password: string,
    fullName: string,
    role: string,
    imageUrl: string
  ) {
    const userCredential = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    const uid = userCredential.user.uid;

    await setDoc(doc(this.firestore, 'users', uid), {
      fullName,
      email,
      role,
      imageUrl,
      address: '',
      phone: '',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      wishlist: [],
      selected: false,
    });

    return uid;
  }

  async updateUser(uid: string, userData: Partial<User>) {
    const userRef = doc(this.firestore, 'users', uid);
    await updateDoc(userRef, userData);
  }
}
