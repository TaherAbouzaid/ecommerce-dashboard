// import { Injectable } from '@angular/core';
// import {
//   CanActivate,
//   ActivatedRouteSnapshot,
//   RouterStateSnapshot,
//   Router,
// } from '@angular/router';
// import { AuthService } from '../../services/auth.service';
// import { UserService } from '../../services/user.service';
// import { from, Observable, of } from 'rxjs';
// import { switchMap, map, take } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthRoleGuard implements CanActivate {
//   authService: any;
//   constructor(
//     private router: Router,
//     // private authService: AuthService,
//     private userService: UserService
//   ) {}

//   canActivate(
//     next: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ): Observable<boolean> {
//     const allowedRoles = next.data['roles'] as string[];

//     return from(this.authService.getUser() as Promise<{ uid: string } | null>).pipe(
//       take(1),
//       switchMap((user: { uid: string } | null) => {
//         if (user) {
//           return this.userService.getUserById(user.uid).pipe(
//             map((userData) => {
//               if (
//                 userData &&
//                 userData.role &&
//                 allowedRoles.includes(userData.role)
//               ) {
//                 return true;
//               } else {
//                 this.router.navigate(['/unauthorized']);
//                 return false;
//               }
//             })
//           );
//         } else {
//           this.router.navigate(['/login']);
//           return of(false);
//         }
//       })
//     );
//   }
// }
