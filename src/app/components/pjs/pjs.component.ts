import { Component, inject, signal } from '@angular/core';
import { PjService } from '../../services/add-pj.service';
import { Pj } from '../../interfaces/pj.interface';
import { RouterLink } from '@angular/router';
import { AddPjComponent } from '../add-pj/add-pj.component';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-pjs',
  standalone: true,
  imports: [RouterLink, AddPjComponent, TitleCasePipe],
  templateUrl: './pjs.component.html',
  styleUrl: './pjs.component.scss',
})
export class PjsComponent {
  pjService = inject(PjService);

  pjs = signal<Pj[]>([]);
  sectionHeight = signal('calc(100vh - 80px)');
  sectionOverflow = signal('auto');

  constructor() {
    this.updatePjs();
    this.getPjs();
  }

  getPjs() {
    this.pjService.pjs$.subscribe((pjs) => {
      this.pjs.set(pjs);
    });
  }

  onChildrenToggled(showChildren: boolean) {
    if (showChildren) {
      this.sectionHeight.set('calc(100vh - 80px)');
    } else {
      this.sectionHeight.set('calc(100vh - 460px)');
    }
  }

  updatePjs() {
    this.pjService.updatePjs();
  }
}
