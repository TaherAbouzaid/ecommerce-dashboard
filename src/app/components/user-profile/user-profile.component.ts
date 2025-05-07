import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  user: User | undefined;
  loading: boolean = true;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    const userId = 'some-uid-here';

    this.userService.getUserById(userId).subscribe(
      (userData) => {
        this.user = userData;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching user data', error);
        this.loading = false;
      }
    );
  }
}
