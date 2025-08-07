import {Component, OnInit} from '@angular/core';
import {ApplicationConfigService} from './service/application-config.service';
import {environment} from './environments/environment';
import {AppService} from './service/app.service';
import {catchError, tap} from 'rxjs';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  constructor(appConfig: ApplicationConfigService, private appService: AppService) {
    appConfig.setEndpointPrefix(environment.apiUrl);
  }
  imageqr : any
  qrCodeBase64: string | null = null;
  name: string | null = null;
  svg:any = null;
  ngOnInit(): void {
    this.fetchUserIdAndGenerateQrCode();
  }

  fetchUserIdAndGenerateQrCode(): void {
    this.appService.getUserId().pipe(
      tap((params: any) => {
        console.log('User ID fetched:', params.access_token);
        this.name = params.name; // Assuming the API response includes a name field
        this.generateQrCode(params.sub);
      }),
      catchError((err) => {
        console.error('Failed to get user ID', err);
        return [];
      })
    ).subscribe();
  }

  generateQrCode(id: string): void {
    this.appService.generateQRCode(id).pipe(
      tap((svgString: string) => {
        this.svg = svgString

        if (svgString.startsWith('data:image/svg+xml;base64,')) {
          this.qrCodeBase64 = svgString;
        } else {
          this.qrCodeBase64 = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
        }
      }),
      catchError((err) => {
        console.error('Failed to generate QR code', err);
        return [];
      })
    ).subscribe();
  }
}
