import { Injectable } from '@angular/core';
import { EmptyError, Observable, throwError, BehaviorSubject, pipe } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  IBlobObject,
  BlobObject,
  IBlobListRequest,
  IBlobRenameRequest,
  IBlobFileRequest,
  IBlobRef,
  IDownloadItem,
} from './iblob';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';

//import { stringify } from 'querystring';

import { environment } from 'src/environments/environment';
import { MaterialModule } from '@app/material.module';

@Injectable({
  providedIn: 'root',
})
export class BlobService {
  private subjectBlobs = new BehaviorSubject<IBlobRef[]>([]);
  $blobs: Observable<IBlobRef[]> = this.subjectBlobs.asObservable();

  private subjectContainers = new BehaviorSubject<string[]>([]);
  $containers: Observable<string[]> = this.subjectContainers.asObservable();

  apiUrl: string = environment.morrisStorageApiUrl;
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  private imageFileTypes = ['image/apng', 'image/bmp', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml'];
  private _isChrome: boolean = false;
  private _isSafari: boolean = false;
  private _blobListRequest: IBlobListRequest = {
    containerName: environment.clientId,
    prefix: '',
    partialstring: '',
    metadatakey: '',
    metadatavalue: '',
    extensions: [],
  };
  constructor(private http: HttpClient) {
    this._isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    this._isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;
    this.apiUrl = environment.morrisStorageApiUrl;

    this.loadBlobs(this._blobListRequest);
    this.loadContainers();
  }

  // Get last value without subscribing to the puppies$ observable (synchronously).
  getBlobs(): IBlobRef[] {
    return this.subjectBlobs.getValue();
  }

  // Get last value without subscribing to the puppies$ observable (synchronously).
  getContainers(): string[] {
    return this.subjectContainers.getValue();
  }

  private _setBlobs(blobs: IBlobRef[]): void {
    this.subjectBlobs.next(blobs);
  }

  private _setContainers(containers: string[]): void {
    this.subjectContainers.next(containers);
  }

  // validateFile(file: File): boolean {
  //   return this.imageFileTypes.includes(file.type);
  // }

  // Upload a file
  public uploadFile(formData: FormData) {
    let API_URL = `${this.apiUrl}/Files/UploadFile`;
    this.http
      .post<any>(API_URL, formData, {
        // headers: new HttpHeaders().set('Content-Type', 'multipart/form-data'),
        reportProgress: true,
        observe: 'events',
      })
      .subscribe((data) => {
        return data;
      });
  }

  public updateMetadata(blobref: IBlobRef) {
    //alert(JSON.stringify(blobref));
    let API_URL = `${this.apiUrl}/Files/UpdateMetadata`;
    this.http
      .put(API_URL, blobref, {
        // headers: new HttpHeaders().set('Content-Type', 'multipart/form-data'),
        reportProgress: true,
        responseType: 'text',
        observe: 'response',
      })
      .subscribe((data) => {
        return data;
      });
  }
  // List files
  public loadContainers(prefix: string = '') {
    let API_URL = `${this.apiUrl}/Files/containers/{prefix}`;
    const loadContainers = this.http
      .get<string[]>(API_URL, {
        headers: this.headers,
        observe: 'response',
      })
      .pipe(
        map((response) => response['payload']),
        catchError((err) => {
          const message = "Could not load containers prefixed with '" + prefix + "'.";
          console.log(message, err);
          return throwError(err);
        }),
        tap((containers) => this.subjectContainers.next(containers))
      );
    loadContainers.subscribe();
  }

  // List files
  public loadBlobs(formData: IBlobListRequest) {
    let API_URL = `${this.apiUrl}/Files/ListFiles`;
    const loadBlobs = this.http
      .post<IBlobRef[]>(API_URL, formData, {
        // headers: this.headers,
        reportProgress: true,
        observe: 'response',
      })
      .pipe(
        map((response) => response['payload']),
        catchError((err) => {
          const message = 'Could not load blobs from ' + formData.containerName;
          console.log(message, err);
          return throwError(err);
        }),
        tap((blobs) => this.subjectBlobs.next(blobs))
      );
    loadBlobs.subscribe();
  }

  // List files
  public listFiles(formData: IBlobListRequest): Observable<HttpResponse<IBlobRef[]>> {
    let API_URL = `${this.apiUrl}/Files/ListFiles`;
    return this.http.post<IBlobRef[]>(API_URL, formData, {
      // headers: this.headers,
      reportProgress: true,
      observe: 'response',
    });
  }

  // Rename a file
  public renameFile(formData: IBlobRenameRequest) {
    let API_URL = `${this.apiUrl}/Files/RenameFile`;
    this.http.put(API_URL, formData, { observe: 'response', responseType: 'text' }).subscribe({
      next: (data) => {
        return data;
      },
      error: (error) => console.error('There was an error!', error),
    });
  }

  // Delete a file
  public deleteFile(formData: IBlobFileRequest) {
    let API_URL = `${this.apiUrl}/Files/DeleteFile`;
    this.http.put(API_URL, formData, { observe: 'events', responseType: 'text' }).subscribe({
      next: (data) => {
        return data;
      },
      error: (error) => console.error('There was an error!', error),
    });
  }

  // Download a file
  public downloadFile(formData: IBlobFileRequest) {
    let API_URL = `${this.apiUrl}/Files/DownloadFile`;
    this.http
      .post<any>(API_URL, formData, {
        headers: this.headers,
        reportProgress: true,
        observe: 'events',
      })
      .subscribe({
        next: (data) => {
          return data;
        },
        error: (error) => console.error('There was an error!', error),
      });
  }

  public downloadFiles(formData: IDownloadItem[]) {
    // The Observable returned by get() is of type Observable<string>
    // because a text response was specified.
    // There's no need to pass a <string> type parameter to get().
    confirm('Download?');
    let API_URL = `${this.apiUrl}/Files/DownloadFilesAsync`;

    this.http
      .post<any>(API_URL, formData, {
        headers: this.headers,
        reportProgress: true,
        observe: 'events',
      })
      .subscribe({
        next: (data) => {
          return data;
        },
        error: (error) => console.error('There was an error!', error),
      });
  }

  downloadFileII(formData: IBlobFileRequest) {
    // The Observable returned by get() is of type Observable<string>
    // because a text response was specified.
    // There's no need to pass a <string> type parameter to get().
    confirm('Download?');
    let url: string = `https://mcprima.blob.core.windows.net/${formData.containerName}/${formData.blobName}`;
    this._downloadFile(url);
    return this.http.get(url, { responseType: 'blob' }).pipe(
      tap(
        // Log the result or error
        (data) => this.log(url),
        (error) => this.logError(url, error)
      )
    );
  }

  private log(filename: string) {
    const message = `DownloaderService downloaded "${filename}".`;
    //this.messageService.add(message);
  }

  private logError(filename: string, error: any) {
    const message = `DownloaderService failed to download "${filename}"; got error "${error.message}".`;
    console.error(message);
    //this.messageService.add(message);
  }
  private _downloadFile = function (sUrl: string) {
    //iOS devices do not support downloading. We have to inform user about this.
    if (/(iP)/g.test(navigator.userAgent)) {
      //alert('Your device does not support files downloading. Please try again in desktop browser.');
      return false;
    }

    //If in Chrome or Safari - download via virtual link click
    if (this._isChrome || this._isSafari) {
      //Creating new link node.
      var link = document.createElement('a');
      link.href = sUrl;

      if (link.download !== undefined) {
        //Set HTML5 download attribute. This will prevent file from opening if supported.
        var fileName = sUrl.substring(sUrl.lastIndexOf('/') + 1, sUrl.length);
        link.download = fileName;
      }

      //Dispatching click event.
      if (document.createEvent) {
        var e = document.createEvent('MouseEvents');
        e.initEvent('click', true, true);
        link.dispatchEvent(e);
        return true;
      }
    }

    // Force file download (whether supported by server).
    if (sUrl.indexOf('?') === -1) {
      sUrl += '?download';
    }

    window.open(sUrl, '_self');
    return true;
  };
}
