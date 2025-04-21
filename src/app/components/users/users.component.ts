import { Component, NgModule, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';

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

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
      console.log(this.users);
    });
  }
}
