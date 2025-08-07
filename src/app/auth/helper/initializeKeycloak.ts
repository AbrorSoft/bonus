import {KeycloakService} from '../services/keycloak';


export function initializeKeycloak(keycloak: KeycloakService) {
  return () => keycloak.init();
}
