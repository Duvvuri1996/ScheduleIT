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
private url : "http://localhost:3000";

  constructor(
    public http : HttpClient
  ) { }


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
    return this.http.post(`${this.url}/api/v1/user/signup`, params)
  } //end signUp function

  public login(data) : Observable<any> {
    const params = new HttpParams()
    .set('email', data.email)
    .set('password', data.password)
    return this.http.post(`${this.url}/api/v1/user/login`, params)
  } //end login function

  public logout() : Observable<any> {
    const params = new HttpParams()
    .set('authToken', Cookie.get('authToken'))
    return this.http.post(`${this.url}api/v1/logout`, params)
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
