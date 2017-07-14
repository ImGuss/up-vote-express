import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class SpotifyService {

  constructor(private _http: Http) {

    this.getAuthorization();
  }

  private clientId = 'b5f77a5c0aa943e4929cd63587ff7219';
  private clientSecret = '3e2ba97729d74986a3ead8194d275aae';

  private redirectUri = 'http://localhost:4200/callback';

  static baseUrl = 'https://api.spotify.com/v1';
  static tokenApi = 'https://accounts.spotify.com/api/token';

  private data: Object;
  private accessToken: string;

  getAuthorization() {

    const headers: Headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Authorization', 'Basic ' + btoa(this.clientId + ':' + this.clientSecret));

    const reqOptions: RequestOptions = new RequestOptions();

    reqOptions.headers = headers;

    this._http.post(`${SpotifyService.tokenApi}`, 'grant_type=client_credentials', reqOptions)
    .subscribe( (res: Response) => {

      // converting response data to json object
      this.data = res.json();

      // accessing access_token key from 'this.data' which returns the access token value
      this.accessToken = this.data['access_token'];
      console.log(this.accessToken);
    });



    // const authParams: string = [
    //   `client_id=${this.clientId}`,
    //   `response_type=code`,
    //   `redirect_uri=${this.redirectUri}`
    // ].join('&');
    //
    // const authUrl: string = `https://accounts.spotify.com/authorize/?${authParams}`;
    //
    // console.log(authUrl);
    //
    // return this._http.get(authUrl).map( res => res.json);
  }

  searchTrack(query: string) {

    let headers = new Headers({Authorization: 'blah'});
    let options = new RequestOptions({ headers: headers });

    let params: string = [`query=${query}`, `type=track`, `offset=0`, `limit=20`, `market=US`, `access_token=${this.accessToken}`].join('&');
    console.log(params);

    let queryUrl: string = `https://api.spotify.com/v1/search?${params}`;

     return this._http.get(queryUrl).map(res => res.json());
  }

}
