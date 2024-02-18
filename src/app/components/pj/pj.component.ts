import { Location, TitleCasePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Pj } from '../../interfaces/pj.interface';

@Component({
  selector: 'app-pj',
  templateUrl: './pj.component.html',
  styleUrls: ['./pj.component.scss'],
  imports: [RouterLink, TitleCasePipe],
  standalone: true,
})
export class PjComponent {
  private router = inject(Router);
  private location = inject(Location);

  pj: Pj = { name: '', fenix: 0, blason: 0, ala: 0, cresta: 0, exp: 0 };
  currentUrl: string = '';

  ngOnInit(): void {
    this.currentUrl = this.location.path();
    const pjsString = localStorage.getItem('pjs');
    if (pjsString) {
      const pjs: Pj[] = JSON.parse(pjsString);
      const pj = pjs.find(
        (p) => p.name === this.currentUrl.replace('/', '').replace('%20', ' ')
      );
      if (pj) {
        this.pj = pj;
      } else {
        this.router.navigate(['/']);
      }
    } else {
      this.router.navigate(['/']);
    }
  }

  updatePjs(): void {
    const pjsString = localStorage.getItem('pjs');
    if (pjsString) {
      const pjs: Pj[] = JSON.parse(pjsString);
      const updatedPjs = pjs.map((p) =>
        p.name === this.pj.name ? this.pj : p
      );
      localStorage.setItem('pjs', JSON.stringify(updatedPjs));
    }
  }

  savePjs(): void {
    const pjsString = localStorage.getItem('pjs');
    if (!pjsString) {
      localStorage.setItem('pjs', JSON.stringify([this.pj]));
      return;
    } else {
      const pjs: Pj[] = JSON.parse(pjsString);
      const pj = pjs.find((p) => p.name === this.pj.name);
      if (pj) {
        return;
      } else {
        localStorage.setItem('pjs', JSON.stringify([...pjs, this.pj]));
      }
    }
  }

  incrementAttribute(attribute: keyof Pj, value: number): void {
    (this.pj[attribute] as number) += value;
    this.updatePjs();
    this.savePjs();
  }

  decrementAttribute(
    attribute: keyof Pj,
    value: number,
    min: number = 0
  ): void {
    if ((this.pj[attribute] as number) - value >= min) {
      (this.pj[attribute] as number) -= value;
      this.updatePjs();
      this.savePjs();
    }
  }

  plusFenix(value: number): void {
    this.incrementAttribute('fenix', value);
  }

  minusFenix(value: number): void {
    this.decrementAttribute('fenix', value);
  }

  plusBlason(): void {
    if (this.pj.blason === 1) {
      this.decrementAttribute('blason', 1);
      this.incrementAttribute('fenix', 1);
    } else {
      this.incrementAttribute('blason', 1);
    }
  }

  minusBlason(): void {
    if (this.pj.blason <= 0 && this.pj.fenix >= 1) {
      this.incrementAttribute('blason', 1);
      this.decrementAttribute('fenix', 1);
    } else {
      this.decrementAttribute('blason', 1);
    }
  }

  plusAla(): void {
    if (this.pj.ala === 3) {
      this.decrementAttribute('ala', 3);
      this.incrementAttribute('blason', 1);
      if (this.pj.blason >= 2) {
        this.decrementAttribute('blason', 2);
        this.incrementAttribute('fenix', 1);
      }
    } else {
      this.incrementAttribute('ala', 1);
    }
  }

  minusAla(): void {
    if (this.pj.ala <= 0 && this.pj.blason >= 1) {
      if (this.pj.blason === 1) {
        this.decrementAttribute('blason', 1);
        this.incrementAttribute('ala', 3);
      }
    } else if (this.pj.ala <= 0 && this.pj.blason <= 0 && this.pj.fenix >= 1) {
      this.decrementAttribute('fenix', 1);
      this.incrementAttribute('blason', 1);
      this.incrementAttribute('ala', 3);
    } else if (this.pj.ala <= 0 && this.pj.blason <= 0 && this.pj.fenix <= 0) {
      this.decrementAttribute('ala', 0); // No-op
    } else {
      this.decrementAttribute('ala', 1);
    }
  }

  plusCresta(value: number): void {
    this.incrementAttribute('cresta', value);
    while (this.pj.cresta >= 100) {
      this.decrementAttribute('cresta', 100);
      this.incrementAttribute('ala', 1);
      if (this.pj.ala >= 4) {
        this.decrementAttribute('ala', 4);
        this.incrementAttribute('blason', 1);
        if (this.pj.blason >= 2) {
          this.decrementAttribute('blason', 2);
          this.incrementAttribute('fenix', 1);
        }
      }
    }
  }

  minusCresta(value: number): void {
    if (this.pj.cresta - value < 0) {
      if (this.pj.ala >= 1) {
        this.decrementAttribute('ala', 1);
        this.incrementAttribute('cresta', 100 - value);
      } else if (this.pj.blason >= 1) {
        this.decrementAttribute('blason', 1);
        this.incrementAttribute('ala', 3);
        this.incrementAttribute('cresta', 100 - value);
      } else if (this.pj.fenix >= 1) {
        this.decrementAttribute('fenix', 1);
        this.incrementAttribute('blason', 1);
        this.incrementAttribute('ala', 3);
        this.incrementAttribute('cresta', 100 - value);
      }
    } else {
      this.decrementAttribute('cresta', value);
    }
  }

  plusExp(value: number): void {
    this.incrementAttribute('exp', value);
  }

  minusExp(value: number): void {
    this.decrementAttribute('exp', value);
  }

  deletePj() {
    const confirmDelete = window.confirm(
      `¿Seguro que deseas eliminar a ${this.capitalizeWords(this.pj.name)}?`
    );

    if (confirmDelete) {
      const pjsString = localStorage.getItem('pjs');
      if (pjsString) {
        const pjs: Pj[] = JSON.parse(pjsString);
        const updatedPjs = pjs.filter((p) => p.name !== this.pj.name);
        localStorage.setItem('pjs', JSON.stringify(updatedPjs));
        this.router.navigate(['/']);
      }
    } else {
      return;
    }
  }

  capitalizeWords(input: string): string {
    return input.replace(/\b\w/g, function (char) {
      return char.toUpperCase();
    });
  }
}
