import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { Firestore, doc, updateDoc,deleteDoc } from '@angular/fire/firestore';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';



@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [MessageService, ConfirmationService],
 

})
export class UsersComponent implements OnInit {
  users: User[] = [];
  originalUsers: User[] = [];
  roles: string[] = ['admin', 'customer', 'vendor', 'other'];

  constructor(private userService: UserService, private firestore: Firestore,
    private messageService: MessageService,private confirmationService: ConfirmationService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
      this.originalUsers = JSON.parse(JSON.stringify(data));

      this.users.forEach(user => {
        if (!user.name) {
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
      if (current.role !== original.role) {
        const userRef = doc(this.firestore, `Users/${current.userId}`);
        const updatePromise = updateDoc(userRef, { role: current.role })
          .then(() => {
            const userName = current.name || 'Unknown User';
            console.log(`Role updated for ${userName}`);
            this.originalUsers[i].role = current.role;
          })
          .catch((error) => {
            console.error(`Error updating role for ${current.name}:`, error);
          });
  
        promises.push(updatePromise);
      }
    }
  
    Promise.all(promises)
      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Changes saved successfully',
        });
      })
      .catch(() => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to save some changes',
        });
      });
  }
  

  deleteSelectedUsers() {
    const selectedUsers = this.users.filter(user => user.selected);
    const promises = selectedUsers.map(user => {
      const userRef = doc(this.firestore, `Users/${user.userId}`);
      return deleteDoc(userRef)
        .then(() => {
          console.log(`User ${user.name || 'Unknown User'} deleted successfully`);
        })
        .catch(error => {
          console.error(`Error deleting user ${user.name || 'Unknown User'}:`, error);
        });
    });
  
    Promise.all(promises)
      .then(() => {
        this.users = this.users.filter(user => !user.selected);
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: `${selectedUsers.length} user(s) deleted successfully`,
        });
      })
      .catch(error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete some users',
        });
      });
  }
  confirmDeleteSelected() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected users?',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        this.deleteSelectedUsers(); 
      }
    });
  }
  

  } 
  
