import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBabyPush } from '../../shared/interfaces/baby-push.interface';

@Injectable()
export class DataService {

    PUSHES_KEY = 'baby_pushes';
    constructor(private http: HttpClient) { }

    saveLocal(data: IBabyPush[]): void {
        let haveItem = localStorage.getItem(this.PUSHES_KEY);
        if (haveItem) {
            localStorage.removeItem(this.PUSHES_KEY);
        }
        localStorage.setItem(this.PUSHES_KEY, JSON.stringify(data))
    }

    getBabyPushes(): IBabyPush[] | void {
        let item = localStorage.getItem(this.PUSHES_KEY);
        if (item) {
            return JSON.parse(item);
        }
    }



    sendData(data: any): Observable<any> {
        console.log('wwww', data);
        this.saveText(JSON.stringify(data), 'test.json')
        return this.http.post('./assets/data/test.json', data);
    }

    getData(): Observable<any> {
        console.log('aaaa');

        return this.http.get('./assets/data/test.json');
    }

    saveText(text: string, filename: string) {
        var a = document.createElement('a');
        a.setAttribute('./assets/data/test.json', 'data:text/plain;charset=utf-u,' + encodeURIComponent(text));
        a.setAttribute('download', filename);
        a.click()
    }
}