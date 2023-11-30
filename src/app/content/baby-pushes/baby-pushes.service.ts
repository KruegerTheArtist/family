import { Injectable } from '@angular/core';
import { IBabyPush } from '../../shared/interfaces/baby-push.interface';

@Injectable()
export class DataService {

    /** ключ для толчков на бэке */
    readonly PUSHES_KEY = 'baby_pushes';

    /** Сохранить коллекцию в localStorage */
    saveLocal(data: IBabyPush[]): void {
        let haveItem = localStorage.getItem(this.PUSHES_KEY);
        if (haveItem) {
            localStorage.removeItem(this.PUSHES_KEY);
        }
        localStorage.setItem(this.PUSHES_KEY, JSON.stringify(data))
    }

    /** Получить коллекцию из localStorage */
    getBabyPushes(): IBabyPush[] | void {
        let item = localStorage.getItem(this.PUSHES_KEY);
        if (item) {
            return JSON.parse(item);
        }
    }
}