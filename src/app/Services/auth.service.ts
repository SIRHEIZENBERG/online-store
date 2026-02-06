import { Injectable, inject, runInInjectionContext, Injector } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, authState, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly injector = inject(Injector);
  user$: Observable<User | null>;

  constructor() {
    this.user$ = runInInjectionContext(this.injector, () => {
      return authState(this.auth);
    });
  }

  async login(email: string, password: string) {
    return runInInjectionContext(this.injector, async () => {
      return await signInWithEmailAndPassword(this.auth, email, password);
    });
  }

  async logout() {
    return runInInjectionContext(this.injector, async () => {
      return await signOut(this.auth);
    });
  }

  isLoggedIn(): boolean {
    return !!this.auth.currentUser;
  }
}
