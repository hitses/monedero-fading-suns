import { Injectable, computed, signal } from '@angular/core';
import { Pj } from '../interfaces/pj.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PjService {
  private _pjs = new BehaviorSubject<Pj[]>([]);
  pjs$ = this._pjs.asObservable();

  constructor() {
    this.getPjs();
  }

  getPjs() {
    const pjs = localStorage.getItem('pjs');

    if (pjs) {
      this._pjs.next(JSON.parse(pjs));
    }
  }

  addPj(newPj: Pj) {
    const pjs = localStorage.getItem('pjs');

    if (pjs) {
      const parsedPjs: Pj[] = JSON.parse(pjs);

      const isNameDuplicate = parsedPjs.some(
        (pj) => pj.name.toLocaleLowerCase() === newPj.name.toLocaleLowerCase()
      );

      if (isNameDuplicate) {
        return { msg: 'duplicate error' };
      }

      parsedPjs.push(newPj);

      localStorage.setItem('pjs', JSON.stringify(parsedPjs));

      this.getPjs();

      return { msg: 'push' };
    } else {
      localStorage.setItem('pjs', JSON.stringify([newPj]));

      this.getPjs();

      return { msg: 'set' };
    }
  }
}
