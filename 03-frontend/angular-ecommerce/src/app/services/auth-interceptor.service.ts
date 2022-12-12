import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import OktaAuth from '@okta/okta-auth-js';
import { from, lastValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(request, next));
  }


  private async handleAccess(req: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {

    const theEndpoint = environment.apiUrl + "/orders";
    // Only add an access token for secured endpoints
    const securedEndpoints = [theEndpoint];

    if (securedEndpoints.some(url => req.urlWithParams.includes(url))) {
      // get access token
      const accesToken = this.oktaAuth.getAccessToken();

      // clone the request and add new header with access token

      req = req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + accesToken
        }
      });
    }
    return await lastValueFrom(next.handle(req));
  }
}
