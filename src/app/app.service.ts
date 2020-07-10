import { Injectable } from '@angular/core';

// Install Observable and cookie and Import them
import { Observable } from 'rxjs/Observable';
import { Cookie } from 'ng2-cookies/ng2-cookies';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AppService {
public url : "http://localhost:3000/api/v1/user";

  constructor(
    public http : HttpClient
  ) { }


  public getCountryNames() : Observable<any> {
    return this.http.get(`${this.url}/allnames`)
  }

  public setUserInfoInLocalStorage = (data) => {

    localStorage.setItem('userInfo', JSON.stringify(data))

  }
  public getUserInfoFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem('userInfo'))
  }

  public signUpFunction(data) : Observable<any> {
    const params = new HttpParams()
    .set('firstName', data.firstName)
    .set('lastName', data.lastName)
    .set('email', data.email)
    .set('password', data.password)
    .set('uniqueUserName', data.uniqueUserName)
    .set('mobileNumber', data.mobileNumber)
    .set('isAdmin', data.isAdmin)
    .set('country', data.country)
    return this.http.post(`${this.url}/signup`, params)
  } //end signUp function

  public login(data) : Observable<any> {
    const params = new HttpParams()
    .set('email', data.email)
    .set('password', data.password)
    return this.http.post(`${this.url}/login`, params)
  } //end login function

  public logout() : Observable<any> {
    const params = new HttpParams()
    .set('authToken', Cookie.get('authToken'))
    return this.http.post(`${this.url}/logout`, params)
  } //end logout function


  private errorHandler(err: HttpErrorResponse) {
    let errorMessage = '';
    //instanceof tests the presence of err.error in Error if present returns true
    if(err.error instanceof Error){
      errorMessage = `An error occured at : ${err.error.message}`
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`
    }
    console.log(errorMessage)

    return Observable.throw(errorMessage)

  }
}
