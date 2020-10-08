import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { IPrincipal } from 'src/models/Principal';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private readonly httpClient: HttpClient, private readonly jwtHelper: JwtHelperService) {
    this.init();
  }

  get principal$(): Observable<IPrincipal> {
    return this.observablePrincipalSubject;
  }

  private readonly principalSubject: BehaviorSubject<IPrincipal> = new BehaviorSubject(null);
  private readonly observablePrincipalSubject: Observable<IPrincipal> = this.principalSubject.asObservable();

  private static getPrincipal = (jwtHelper: JwtHelperService) => {
    const decodedToken: any | undefined | null = jwtHelper.decodeToken(localStorage.getItem('authToken'));
    if (decodedToken) {
      const { unique_name, email, sub, given_name, avatar, exp } = decodedToken as any;
      const principal: IPrincipal = { expiration: exp, avatar, displayName: given_name, email, id: sub, roles: (decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] as string).split(/,/), username: unique_name };

      return principal;
    } else { return null; }
  }

  private set principal(principal: IPrincipal) {
    this.principalSubject.next(principal);
  }

  private init = () => this.principal = AuthService.getPrincipal(this.jwtHelper);

  isSignedIn = () => {
    return this.principal$
      .pipe(map(principal => principal && principal.expiration > Date.now()));
  }

  isInRole = (role: string) => {
    return this.principal$
      .pipe(map(principal => principal && this.principal.expiration > Date.now() && principal.roles && principal.roles.includes(role)));
  }

  signIn = (username: string, password: string) => {
    this.httpClient.post<{ authToken: string }>(`${environment.apiOrigin}/users/login`, null, {
      headers: {
        authorization: `Basic ${btoa(`${username}:${password}`)}`
      }
    }).toPromise()
      .then(data => {
        localStorage.setItem('authToken', data.authToken);
        this.init();
      });
  }

  signOut = () => () => {
    return this.isSignedIn()
      .subscribe(val => {
        if (val) {
          localStorage.removeItem('authToken');
          this.init();
        }
      });
  }
}
