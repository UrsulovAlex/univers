import { inject, Injectable } from '@angular/core';
import { API_URL } from '../configs/main-config';
import { HttpClient } from '@angular/common/http';
import { catchError, EMPTY, Observable, take, tap } from 'rxjs';
import { DocumentStatusType } from '../Types/documentStatus';

@Injectable({
    providedIn: 'root'
})

export class DocumentService { 
    private apiUrl = API_URL;
    private httpClient = inject(HttpClient);

    documentById(id:string): Observable<any> {
        return this.httpClient.get(`${this.apiUrl}/v1/document/${id}`).pipe(
            take(1),
            catchError((err) => {
                console.log('Show document error', err);
                return EMPTY;
            })
        );
    }

    deleteDocument(id:string): Observable<any>  {
        return this.httpClient.delete(`${this.apiUrl}/v1/document/${id}`).pipe(
            take(1),
            catchError((err) => {
                console.log('Delete document failed', err);
                return EMPTY;
            })
        )
    }

    shangeStatusDocument(id: string, status: DocumentStatusType): Observable<any>{
        return this.httpClient.post(`${this.apiUrl}/v1/document/${id}/change-status`, {status})
        .pipe(
            take(1),
            catchError((err) => {
                console.log('Delete document failed', err);
                return EMPTY;
            })
        )
    }

    rewokeReview(id:string): Observable<any> {
        return this.httpClient.post(`${this.apiUrl}/v1/document/${id}/revoke-review`, {id})
        .pipe(
            take(1),
            catchError((err) => {
                console.log('Delete document failed', err);
                return EMPTY;
            })
        )
    }

    sendToReview(id:string): Observable<any> {
        return this.httpClient.post(`${this.apiUrl}/v1/document/${id}/send-to-review`, {id})
        .pipe(
            take(1),
            catchError((err) => {
                console.log('Delete document failed', err);
                return EMPTY;
            })
        )

    }

    changeName(id: string, name:string): Observable<any> {
        return this.httpClient.patch(`${this.apiUrl}/v1/document/${id}`, {name}).pipe(
            take(1),
            catchError((err) => {
                console.log('Change document failed', err);
                return EMPTY;
            })
        )
    }

    addNewDocunent(status: string, file: File, name: any): Observable<any> {
        const formData = new FormData();
		formData.append('file', file);
        formData.append('name', file.name);
        formData.append('status', status);


        return this.httpClient.post(`${this.apiUrl}/v1/document`, formData)     
        .pipe(
            catchError((err) => {
                    console.error('Upload file Erorr', err);
                    return EMPTY
                }
            ),
            take(1),
        )
    }
}