import {Injectable} from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({ providedIn: 'root' })
export class KeycloakService {
  private keycloak: Keycloak;

  constructor() {
    this.keycloak = new Keycloak({
      url: 'https://bonus-kc.devops.uz',
      realm: 'bonus',
      clientId: 'web_app'
    });
  }

  init(): Promise<boolean> {
    return this.keycloak.init({
      onLoad: 'login-required',
      pkceMethod: 'S256',
      checkLoginIframe: false
    }).then(authenticated => {
      console.log('[Keycloak] Authenticated:', authenticated);

      if (authenticated) {
        this.storeTokens();
      }

      return authenticated;
    }).catch(err => {
      console.error('[Keycloak] Init failed', err);
      return false;
    });
  }

  private storeTokens(): void {
    localStorage.setItem('access_token', this.keycloak.token || '');
    localStorage.setItem('refresh_token', this.keycloak.refreshToken || '');
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  logout(): void {
    this.keycloak.logout();
    localStorage.clear();
  }

  refreshToken(): Promise<void> {
    return this.keycloak.updateToken(60).then(refreshed => {
      if (refreshed) {
        console.log('[Keycloak] Token refreshed');
        this.storeTokens();
      } else {
        console.log('[Keycloak] Token not refreshed, still valid');
      }
    }).catch(err => {
      console.error('[Keycloak] Failed to refresh token', err);
    });
  }



  isAuthenticated(): boolean {
    return !!this.keycloak?.token;
  }
}
