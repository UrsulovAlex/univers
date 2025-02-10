import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {
    getData (key: string){
        const reportDataLocal = localStorage.getItem(key);
        if (reportDataLocal?.length){
            return JSON.parse(reportDataLocal);
        }
    }

    setData<T> (key: string, value: T){
        localStorage.setItem(key, JSON.stringify(value));
    }

    remove(key: string) {
        localStorage.removeItem(key);
    }
}