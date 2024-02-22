import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PjService } from '../../services/add-pj.service';
import { NgClass, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'component-add-pj',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, TitleCasePipe],
  templateUrl: './add-pj.component.html',
  styleUrl: './add-pj.component.scss',
})
export class AddPjComponent {
  @Output() childrenToggled: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  private fb = inject(FormBuilder);
  private pjService = inject(PjService);

  addPjForm!: FormGroup;
  showForm = signal(false);
  slideForm = signal(false);

  duplicateError = signal(false);
  duplicatedName = signal('');

  constructor() {
    this.createForm();
  }

  createForm() {
    this.addPjForm = this.fb.group({
      name: [
        ,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20),
        ],
      ],
      fenix: [0, [Validators.required, Validators.min(0)]],
      blason: [0, [Validators.required, Validators.min(0), Validators.max(1)]],
      ala: [0, [Validators.required, Validators.min(0), Validators.max(3)]],
      cresta: [0, [Validators.required, Validators.min(0), Validators.max(99)]],
      exp: [0, [Validators.required, Validators.min(0)]],
    });
  }

  toggleShowForm(showChildren: boolean) {
    this.showForm.set(!this.showForm());
    this.childrenToggled.emit(showChildren);

    if (this.showForm()) {
      this.createForm();
      this.duplicateError.set(false);
    }
  }

  toggleSlideForm() {
    this.slideForm.set(!this.slideForm());
  }

  addPjValidField(field: string) {
    return (
      this.addPjForm.controls[field].errors &&
      this.addPjForm.controls[field].touched
    );
  }

  addPj(showChildren: boolean) {
    this.duplicateError.set(false);

    if (this.addPjForm.invalid) {
      this.addPjForm.markAllAsTouched();
      return;
    }

    const { name, fenix, blason, ala, cresta, exp } = this.addPjForm.value;
    const formatedName = name.trim().toLowerCase();

    const res = this.pjService.addPj({
      name: formatedName,
      fenix,
      blason,
      ala,
      cresta,
      exp,
    });

    if (res.msg === 'duplicate error') {
      this.duplicateError.set(true);
      this.duplicatedName.set(name);
      return;
    }

    this.showForm.set(false);
    this.childrenToggled.emit(showChildren);
  }

  validateFenix(event: any) {
    const value = event.target.value;
    if (value < 0) {
      event.target.value = 0;
    }
  }

  validateBlason(event: any) {
    const value = event.target.value;
    if (value < 0) {
      event.target.value = 0;
    } else if (value > 1) {
      event.target.value = 1;
    }
  }

  validateAla(event: any) {
    const value = event.target.value;
    if (value < 0) {
      event.target.value = 0;
    } else if (value > 3) {
      event.target.value = 3;
    }
  }

  validateCresta(event: any) {
    const value = event.target.value;
    if (value < 0) {
      event.target.value = 0;
    } else if (value > 99) {
      event.target.value = 99;
    }
  }

  validateExp(event: any) {
    const value = event.target.value;
    if (value < 0) {
      event.target.value = 0;
    }
  }
}
