import { inject, Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from '../Models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private firestore = inject(Firestore);

  getUsers(): Observable<User[]> {
    const usersRef = collection(this.firestore, 'Users');
    return collectionData(usersRef, { idField: 'userId' }) as Observable<User[]>;
  }
}
