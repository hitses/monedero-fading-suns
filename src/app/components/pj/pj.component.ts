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
}

// import { Component, inject, signal } from '@angular/core';
// import { Router, RouterLink } from '@angular/router';
// import { Pj } from '../../interfaces/pj.interface';
// import { Location, TitleCasePipe } from '@angular/common';

// @Component({
//   selector: 'app-pj',
//   standalone: true,
//   imports: [RouterLink, TitleCasePipe],
//   templateUrl: './pj.component.html',
//   styleUrl: './pj.component.scss',
// })
// export class PjComponent {
//   private router = inject(Router);
//   private location = inject(Location);

//   stringifyPjs = signal<string>('');
//   pjs = signal<Pj[]>([]);
//   pj = signal<Pj>({
//     name: '',
//     fenix: 0,
//     blason: 0,
//     ala: 0,
//     cresta: 0,
//     exp: 0,
//   });
//   currentUrl = signal('');

//   constructor() {
//     this.currentUrl.set(this.location.path());
//     this.stringifyPjs.set(localStorage.getItem('pjs')!);
//     this.pjs.set(JSON.parse(this.stringifyPjs()));
//     this.getPj();
//   }

//   getPj() {
//     if (!this.stringifyPjs()) this.router.navigate(['/']);

//     this.pj.set(
//       this.pjs().find(
//         (pj: Pj) =>
//           pj.name === this.currentUrl().replace('/', '').replace('%20', ' ')
//       )!
//     );
//   }

//   plusFenix(value: number) {
//     this.pj.set({
//       ...this.pj(),
//       fenix: this.pj().fenix + value,
//     });

//     this.updatePjs();
//     this.savePjs();
//   }

//   minusFenix(value: number) {
//     this.pj.set({
//       ...this.pj(),
//       fenix: this.pj().fenix - value,
//     });

//     if (this.pj().fenix < 0) {
//       this.pj.set({
//         ...this.pj(),
//         fenix: this.pj().fenix + value,
//       });

//       this.updatePjs();
//       this.savePjs();

//       return;
//     }

//     this.updatePjs();
//     this.savePjs();
//   }

//   plusBlason() {
//     if (this.pj().blason === 1) {
//       this.pj.set({
//         ...this.pj(),
//         blason: 0,
//       });

//       this.pj.set({
//         ...this.pj(),
//         fenix: this.pj().fenix + 1,
//       });

//       this.updatePjs();
//       this.savePjs();

//       return;
//     }

//     this.pj.set({
//       ...this.pj(),
//       blason: this.pj().blason + 1,
//     });

//     this.updatePjs();
//     this.savePjs();
//   }

//   minusBlason() {
//     if (this.pj().blason <= 0 && this.pj().fenix >= 1) {
//       this.pj.set({
//         ...this.pj(),
//         blason: 1,
//       });

//       this.pj.set({
//         ...this.pj(),
//         fenix: this.pj().fenix - 1,
//       });

//       this.updatePjs();
//       this.savePjs();

//       return;
//     }

//     this.pj.set({
//       ...this.pj(),
//       blason: this.pj().blason - 1,
//     });

//     this.updatePjs();
//     this.savePjs();
//   }

//   plusAla() {
//     if (this.pj().ala === 3) {
//       this.pj.set({
//         ...this.pj(),
//         ala: 0,
//       });

//       this.pj.set({
//         ...this.pj(),
//         blason: this.pj().blason + 1,
//       });

//       if (this.pj().blason >= 2) {
//         this.pj.set({
//           ...this.pj(),
//           blason: 0,
//         });

//         this.pj.set({
//           ...this.pj(),
//           fenix: this.pj().fenix + 1,
//         });
//       }

//       this.updatePjs();
//       this.savePjs();

//       return;
//     }

//     this.pj.set({
//       ...this.pj(),
//       ala: this.pj().ala + 1,
//     });

//     this.updatePjs();
//     this.savePjs();
//   }

//   minusAla() {
//     if (this.pj().ala <= 0 && this.pj().blason >= 0 && this.pj().fenix >= 1) {
//       this.pj.set({
//         ...this.pj(),
//         ala: 3,
//       });

//       if (this.pj().blason === 1) {
//         this.pj.set({
//           ...this.pj(),
//           blason: 0,
//         });
//       } else if (this.pj().blason <= 0) {
//         this.pj.set({
//           ...this.pj(),
//           blason: 1,
//         });

//         this.pj.set({
//           ...this.pj(),
//           fenix: this.pj().fenix - 1,
//         });
//       }

//       this.updatePjs();
//       this.savePjs();

//       return;
//     } else if (this.pj().ala <= 0 && this.pj().blason > 0) {
//       this.pj.set({
//         ...this.pj(),
//         ala: 3,
//       });

//       this.pj.set({
//         ...this.pj(),
//         blason: 0,
//       });

//       this.updatePjs();
//       this.savePjs();

//       return;
//     } else if (
//       this.pj().ala <= 0 &&
//       this.pj().blason <= 0 &&
//       this.pj().fenix <= 0
//     ) {
//       this.pj.set({
//         ...this.pj(),
//         ala: 0,
//       });

//       this.updatePjs();
//       this.savePjs();

//       return;
//     }

//     this.pj.set({
//       ...this.pj(),
//       ala: this.pj().ala - 1,
//     });

//     this.updatePjs();
//     this.savePjs();
//   }

//   plusCresta(value: number) {
//     this.pj.set({
//       ...this.pj(),
//       cresta: this.pj().cresta + value,
//     });

//     if (this.pj().cresta >= 100) {
//       this.pj.set({
//         ...this.pj(),
//         cresta: this.pj().cresta - 100,
//       });

//       this.pj.set({
//         ...this.pj(),
//         ala: this.pj().ala + 1,
//       });

//       if (this.pj().ala >= 4) {
//         this.pj.set({
//           ...this.pj(),
//           ala: 0,
//         });

//         this.pj.set({
//           ...this.pj(),
//           blason: this.pj().blason + 1,
//         });

//         if (this.pj().blason >= 2) {
//           this.pj.set({
//             ...this.pj(),
//             blason: 0,
//           });

//           this.pj.set({
//             ...this.pj(),
//             fenix: this.pj().fenix + 1,
//           });
//         }
//       }

//       this.updatePjs();
//       this.savePjs();

//       return;
//     }

//     this.updatePjs();
//     this.savePjs();
//   }

//   minusCresta(value: number) {
//     if (
//       this.pj().cresta - value < 0 &&
//       this.pj().ala <= 0 &&
//       this.pj().blason <= 0 &&
//       this.pj().fenix <= 0
//     ) {
//       this.pj.set({
//         ...this.pj(),
//         cresta: this.pj().cresta,
//       });

//       this.updatePjs();
//       this.savePjs();

//       return;
//     } else if (this.pj().cresta - value < 0 && this.pj().ala >= 1) {
//       this.pj.set({
//         ...this.pj(),
//         ala: this.pj().ala - 1,
//       });

//       this.pj.set({
//         ...this.pj(),
//         cresta: this.pj().cresta + 100 - value,
//       });

//       this.updatePjs();
//       this.savePjs();

//       return;
//     } else if (
//       this.pj().cresta - value < 0 &&
//       this.pj().ala <= 0 &&
//       this.pj().blason >= 1
//     ) {
//       if (this.pj().blason === 1) {
//         this.pj.set({
//           ...this.pj(),
//           blason: 0,
//         });

//         this.pj.set({
//           ...this.pj(),
//           ala: 3,
//         });

//         this.pj.set({
//           ...this.pj(),
//           cresta: this.pj().cresta + 100 - value,
//         });

//         this.updatePjs();
//         this.savePjs();

//         return;
//       }
//     } else if (
//       this.pj().cresta - value < 0 &&
//       this.pj().ala <= 0 &&
//       this.pj().blason <= 0 &&
//       this.pj().fenix >= 1
//     ) {
//       this.pj.set({
//         ...this.pj(),
//         fenix: this.pj().fenix - 1,
//       });

//       this.pj.set({
//         ...this.pj(),
//         blason: 1,
//       });

//       this.pj.set({
//         ...this.pj(),
//         ala: 3,
//       });

//       this.pj.set({
//         ...this.pj(),
//         cresta: this.pj().cresta + 100 - value,
//       });

//       this.updatePjs();
//       this.savePjs();

//       return;
//     }

//     this.pj.set({
//       ...this.pj(),
//       cresta: this.pj().cresta - value,
//     });

//     this.updatePjs();
//     this.savePjs();
//   }

//   plusExp(value: number) {
//     this.pj.set({
//       ...this.pj(),
//       exp: this.pj().exp + value,
//     });

//     this.updatePjs();
//     this.savePjs();
//   }

//   minusExp(value: number) {
//     if (this.pj().exp <= 0) {
//       this.pj.set({
//         ...this.pj(),
//         exp: this.pj().exp,
//       });

//       this.updatePjs();
//       this.savePjs();

//       return;
//     }

//     this.pj.set({
//       ...this.pj(),
//       exp: this.pj().exp - value,
//     });

//     this.updatePjs();
//     this.savePjs();
//   }

//   updatePjs() {
//     this.pjs.set(
//       this.pjs().map((pj: Pj) => {
//         if (pj.name === this.currentUrl().replace('/', '')) {
//           return this.pj();
//         }
//         return pj;
//       })
//     );
//   }

//   savePjs() {
//     localStorage.setItem('pjs', JSON.stringify(this.pjs()));
//   }
// }
