import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { Firestore, doc, updateDoc,deleteDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ButtonModule,
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  originalUsers: User[] = [];
  roles: string[] = ['admin', 'customer', 'seller', 'other'];

  constructor(private userService: UserService, private firestore: Firestore) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
      this.originalUsers = JSON.parse(JSON.stringify(data));

      this.users.forEach(user => {
        if (!user.fullName) {
          console.warn(`User with ID: ${user.userId} is missing fullName`);
        }
      });
      console.log('Loaded Users:', this.users);
    });
  }

  saveChanges() {
    const promises = [];
  
    for (let i = 0; i < this.users.length; i++) {
      const current = this.users[i];
      const original = this.originalUsers[i];
      
  
      if (!current.userId) continue;
      if (!current.fullName) {
        console.warn(`Full name is missing for user with ID: ${current.userId}`);
      }
  
      if (current.role !== original.role) {
        const userRef = doc(this.firestore, `Users/${current.userId}`);
        console.log('Current User:', current);
        const updatePromise = updateDoc(userRef, { role: current.role })
          .then(() => {
            const userName = current.fullName || 'Unknown User';
            console.log(`Role updated for ${userName}`);
            this.originalUsers[i].role = current.role;
          })
          .catch((error) => {
            console.error(`Error updating role for ${current.fullName}:`, error);
          });
  
        promises.push(updatePromise);
      }
    }
  
    Promise.all(promises)
      .then(() => {
        console.log('All roles updated successfully');
      })
      .catch((error) => {
        console.error('Error updating some roles:', error);
      });
   
    }


    // deleteSelectedUsers() {
    //   const promises = this.users
    //     .filter(user => user.selected) 
    //     .map(user => {
    //       const userRef = doc(this.firestore, `Users/${user.userId}`);
    //       return deleteDoc(userRef)
    //         .then(() => {
    //           console.log(`User ${user.name} deleted successfully`);
    //         })
    //         .catch(error => {
    //           console.error(`Error deleting user ${user.name}:`, error);
    //         });
    //     });
  
    //   Promise.all(promises)
    //     .then(() => {
         
    //       this.users = this.users.filter(user => !user.selected);
    //       console.log('Selected users deleted successfully');
    //     })
    //     .catch(error => {
    //       console.error('Error deleting some users:', error);
    //     });
    // }
  } 
  
