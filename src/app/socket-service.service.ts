import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Cookie } from 'ng2-cookies/ng2-cookies';

import * as io from 'socket.io-client'

import 'rxjs-compat/add/operator/catch';
import 'rxjs-compat/add/operator/do';
import 'rxjs-compat/add/operator/toPromise';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SocketServiceService {

  private url = "http://localhost:3000";
  private socket;

  constructor(public http: HttpClient) {
    
    //connection to the socket starts
    this.socket = io(this.url);
  }

  //events on listening 
  public verifyUserOnConnection = () => {
    return Observable.create((observer) => {
      this.socket.on('verify-user', (data) => {
        observer.next(data)
      })
    })
  } //end verify-user event

  public onlineUserList = () => {
    return Observable.create((observer) => {
      this.socket.on('online-user-list', (userList) => {
        observer.next(userList)
      })
    })
  } //end online-user-list event

  public updatesFromAdmin = (userId) => {
    return Observable.create((observer) => {
      this.socket.on(userId, (data) => {
        observer.next(data)
      })
    })
  } //end updates form admin

  public onAuthError = () => {
    return Observable.create((observer) => {
      this.socket.on('auth-error', (data) => {
        observer.next(data)
      })
    })
  } //end auth-error event

  public onDisconnect = () => {
    return Observable.create((observer) => {
      this.socket.on('disconnect', () => {
        observer.next()
      })
    })
  } //onDisconnect event

  //emitting events
  public setUserOnline = (authToken) => {
    this.socket.emit('set-user', authToken)
  } //end  set-user-online event

  public eventUpdates = (data) => {
    this.socket.emit('event-updates', data)
  } //end notify-updates event

  public exitSocket = () => {
    this.socket.disconnect()
  } //end socket

  private handleError(err: HttpErrorResponse) {

    let errorMessage = '';

    if (err.error instanceof Error) {

      errorMessage = `An error occurred: ${err.error.message}`;

    } else {

      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;

    } // end condition *if

    console.error(errorMessage);

    return Observable.throw(errorMessage);

  }

}
