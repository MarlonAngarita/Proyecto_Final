import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    console.log('🔒 Verificando acceso a ruta protegida...');
    
    const user = this.authService.getCurrentUser();
    
    if (!user) {
      console.warn('⚠️ Usuario no autenticado, redirigiendo a login');
      this.router.navigate(['/login']);
      return false;
    }

    if (!this.authService.hasValidRole(2)) {
      console.warn('⚠️ Usuario no tiene rol de profesor, redirigiendo a inicio');
      this.router.navigate(['/']);
      return false;
    }

    console.log('✅ Acceso permitido');
    return true;
  }
}
