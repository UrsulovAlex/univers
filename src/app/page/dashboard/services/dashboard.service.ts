import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { API_URL } from '../../../core/configs/main-config';
import { catchError, take } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { QueryParams } from '../../../core/interfaces/queryParams.interface';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private apiUrl = API_URL;
    private httpClient = inject(HttpClient);

    initData(queryParams: any): Observable<any> {
        let params = new HttpParams();
        for (const key in queryParams) {
            params = params.set(key, queryParams[key]!.toString());
        }

        return this.httpClient.get(`${this.apiUrl}/v1/document`, {params}).pipe(
        catchError((err) => {
            console.error('Upload file Erorr', err);
            return EMPTY
 
        }),
        take(1)
    )};
}
