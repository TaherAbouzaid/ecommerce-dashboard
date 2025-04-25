// import { inject, Injectable } from '@angular/core';
// import { Firestore, collection, collectionData } from '@angular/fire/firestore';
// import { Observable } from 'rxjs';
// import { User } from '../app/models/user.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class UserService {
//   private firestore = inject(Firestore);

//   getUsers(): Observable<User[]> {
//     const usersRef = collection(this.firestore, 'Users');
//     return collectionData(usersRef, { idField: 'userId' }) as Observable<User[]>;
//   }
// }


import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from '../app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private firestore = inject(Firestore);

  getUsers(): Observable<User[]> {
    const usersRef = collection(this.firestore, 'Users');
    return collectionData(usersRef, { idField: 'userId' }) as Observable<User[]>;
  }

  async saveChanges(users: User[]): Promise<void> {
    const promises = users.map(user => {
      const userRef = doc(this.firestore, `Users/${user.userId}`);
      return updateDoc(userRef, { role: user.role });
    });
    await Promise.all(promises);
  }
}