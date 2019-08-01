import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpHelperService {
  constructor(private http: HttpClient) {}

  private requestOptions: any;



  // Makes and solves a GET request
  getRequest(
    endpoint: string,
    resolve: any,
    reject: any,
    callback?: any,
    errorCallback?: any
  ) {
    this.http.get(endpoint).subscribe(
      (data: any) => {
        console.log(data);

        if (callback) {
          callback(data, resolve);
        } else {
          resolve(data);
        }
      },
      err => {
        return errorCallback
          ? errorCallback(err, reject)
          : this.handleError(err, reject);
      }
    );
  }

  getOptionsHeaders(token) {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'AAAAiJ9ouPw:APA91bHbXVEEAbSu7kDVSb1u5NQn97XdcWMfHC9GLPHo0ocYTU1mK_QU7AQ2Orn9b42gOxoquMlrt_FNVoAgg7GPNNtVALJhapHgAdcthHRjTbBEpKTQxlNljE_hMEENrycfpfr-6YIU'
      })
    };
  }

  // Handle an http error
  handleError(err, reject) {
    console.log(err);
    const status = err.status;
    if (status === 404) {
      if (err.error && err.error.message && err.error.message[0]) {
        return reject(err.error.message[0]);
      } else {
        return reject('Se presentó un error realizando la petición');
      }
    } else if (err.error && err.error.responseText) {
      return reject(err.error.responseText);
    } else {
      return reject('Se presentó un error realizando la petición');
    }
  }

  // Makes and solves a POST request
  postRequest(
    endpoint: string,
    requestBody: any,
    resolve: any,
    reject: any,
    callback?: any
  ) {
    this.requestOptions = this.getOptionsHeaders(requestBody.token);
    this.http.post(endpoint, requestBody).subscribe(
      data => {
        console.log(data);
        if (callback) {
          callback(data, resolve);
        } else {
          resolve(data);
        }
      },
      err => {
        return this.handleError(err, reject);
      }
    );
  }
}
