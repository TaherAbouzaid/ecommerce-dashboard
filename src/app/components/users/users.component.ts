import { Component,  OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import{ Firestore, doc, updateDoc } from '@angular/fire/firestore';


@Component({
  selector: 'app-users',
  imports: [
    CommonModule,
    TableModule,
    CommonModule,
    FormsModule,
    CommonModule,
    ButtonModule,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  roles: string[] = ['admin', 'customer', 'seller','other'];
  originalUsers: User[] = [];


  constructor(private userService: UserService,private firestore: Firestore ) {}


  ngOnInit(): void {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
      //
      this.originalUsers = JSON.parse(JSON.stringify(data));
      console.log(this.users);
    });
  }


  onRoleChange(user: any) {
    if (!user.userId) return;

    const userRef = doc(this.firestore, `Users/${user.userId}`);
    updateDoc(userRef, { role: user.role })
      .then(() => console.log('Role updated successfully'))
      .catch((error) => console.error('Error updating role: ', error));
  }


  saveChanges() {
    for (let i = 0; i < this.users.length; i++) {
      const user = this.users[i];
      const originalUser = this.originalUsers[i];
      if (!user.userId) {
        continue;
      }
      if (user.role !== originalUser.role) {
        const userRef = doc(this.firestore, `Users/${user.userId}`);
        console.log(`Updating role for ${user.userId} from ${originalUser.role} to ${user.role}`);

        updateDoc(userRef, { role: user.role })
          .then(() => console.log(`Role updated for ${user.userId}`))
          .catch((error) => console.error(`Error updating ${user.userId}:`, error));
      }
    }
  }



}


