import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ApplicationConfigService} from './application-config.service';
import {Observable} from 'rxjs';

@Injectable(
  {providedIn: 'root'}
)
export class AppService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {

  }

  resourceUrl = 'https://bonus-kc.devops.uz/realms/bonus/protocol/openid-connect/userinfo';
  token = localStorage.getItem('access_token')
  headers = new HttpHeaders({'Authorization': `Bearer ${this.token}`})

  getUserId(): Observable<any> {
    return this.http.get(this.resourceUrl, {headers: this.headers})
  }

  generateQRCode(id: string): Observable<string> {
    return this.http.post(
      this.applicationConfigService.getEndpointFor(`api/qr/generate/${id}`),
      {},
      {
        headers: this.headers,
        responseType: 'text'
      }
    );
  }
}
