import { Injectable } from '@angular/core';

// Install Observable and cookie and Import them
import { Observable } from 'rxjs/Observable';
import { Cookie } from 'ng2-cookies/ng2-cookies';

import 'rxjs-compat/add/operator/catch';
import 'rxjs-compat/add/operator/do';
import 'rxjs-compat/add/operator/toPromise';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})


export class AppService {

//http://localhost:3000 is declared in proxyConfig file
private url = "http://api.scheduleitweb.co/api/v1";

  constructor(
    public http : HttpClient
  ) { }


  //function to set Login user information in local storage
  public setUserInfoInLocalStorage = (data) => {
    localStorage.setItem('userInfo', JSON.stringify(data))
  }

  //Function to get Login user information from localstorage
  public getUserInfoFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem('userInfo'))
  }

  //signUp function that connects to the API
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
    return this.http.post(`${this.url}/user/signup`, params)
  } //end signUp function

  //login function that connects to the API
  public login(data) : Observable<any> {
    const params = new HttpParams()
    .set('email', data.email)
    .set('password', data.password)
    return this.http.post(`${this.url}/user/login`, params)
  } //end login function

  //logout function that connects to the API
  public logout() : Observable<any> {
    const params = new HttpParams()
    .set('authToken', Cookie.get('authToken'))
    console.log(params)
    return this.http.post(`${this.url}/user/logout`, params)
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

  }// edn erroHandler function

  //Recoverymail function
  public recovery(data): Observable<any> {
    const params = new HttpParams()
    .set('email', data.email)
    return this.http.post(`${this.url}/user/recoverymail`, params)
  } //end recovery function

  //resetPassword function
  public resetPassowrdFromEmail(data) : Observable<any> {
    const params = new HttpParams()
    .set('password', data.password)
    .set('recoveryToken', data.recoveryToken)
    return this.http.post(`${this.url}/user/resetpassword`, params)
  }

  //getNormalUsers from DataBase
  public getAllNormalUsers(authToken): Observable<any> {
    return this.http.get(`${this.url}/user/all/normal?authToken=${authToken}`)
  } //end getAllNormalUsers function

  //getAlllUsers from DataBase
  public getAllUsers(authToken): Observable<any> {
    return this.http.get(`${this.url}/user/all?authToken=${authToken}`)
  } //end getAllNormalUsers function

  //CreateMeeting function
  public createEvent(data): Observable<any>{
    const params = new HttpParams()
    .set('eventTitle', data.eventTitle)
    .set('place', data.place)
    .set('userId', data.userId)
    .set('userName', data.userName)
    .set('userEmail', data.userEmail)
    .set('creatorId', data.creatorId)
    .set('creatorName', data.creatorName)
    .set('startDate', data.startDate)
    .set('endDate', data.endDate)
    .set('authToken', data.authToken)
    return this.http.post(`${this.url}/events/create`, params)
  } //createMeeting function

  //editMeeting function
  public editEvent(data): Observable<any>{
    const params = new HttpParams()
    .set('eventTitle', data.eventTitle)
    .set('place', data.place)
    .set('startDate', data.startDate)
    .set('endDate', data.endDate)
    .set('color', data.color)
    .set('authToken', data.authToken)
    return this.http.put(`${this.url}/events/${data.eventId}/edit`, params)
  }//end function

  //start deleteMeeting function
  public deleteEvent(eventId, authToken): Observable<any> {
    const params = new HttpParams()
      .set('authToken', authToken)
    return this.http.post(`${this.url}/events/${eventId}/delete`, params)
  }//end function

  //getSingleUserEvents from Data base
  public getSingleUserEvents(userId,authToken): Observable<any> {
    console.log(userId +"in app service")
    return this.http.get(`${this.url}/events/all/${userId}?authToken=${authToken}`)
  }//end function

  //getsingleEvent function
  public getSingleEvent(eventId,authToken): Observable<any> {
    return this.http.get(`${this.url}/events/${eventId}?authToken=${authToken}`)
  }//end function

  //reminderMail function to the user
  public reminderMail(userId,authToken): Observable<any> {
    console.log(authToken)
    console.log(userId)
    const params = new HttpParams()
    .set('userId', userId)
    //.set('authToken', authToken)
    return this.http.post(`${this.url}/events/remindertouser?authToken=${authToken}`,params)
  }//end function
  
  //getAllEvents from Database
  public getAllEvents(authToken): Observable<any>{
    return this.http.get(`${this.url}/events/all?authToken=${authToken}`)
  }//end function

}
