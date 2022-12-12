import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Country } from '../common/country';
import { map } from 'rxjs';
import { State } from '../common/state';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ShopFormService {

  private countriesUrl: string = environment.apiUrl + "/countries";
  private stateUrl: string = environment.apiUrl + "/states";

  constructor(private httpClient: HttpClient) { }

  getStates(theCountryCode: string) {
    const searchStatesUrl = `${this.stateUrl}/search/findByCountryCode?code=${theCountryCode}`;
    return this.httpClient.get<GetResponseStates>(searchStatesUrl).pipe(map(respone => respone._embedded.states));
  }

  getCountries(): Observable<Country[]> {
    return this.httpClient.get<GetResponseCountires>(this.countriesUrl).pipe(map(response => response._embedded.countries));
  }

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];
    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }
    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];
    const starYear: number = new Date().getFullYear();
    const endYear: number = starYear + 10;

    for (let theYear = starYear; theYear <= endYear; theYear++) {
      data.push(theYear);
    }

    return of(data);
  }

}

interface GetResponseCountires {
  _embedded: {
    countries: Country[];
  }
}


interface GetResponseStates {
  _embedded: {
    states: State[];
  }
}

