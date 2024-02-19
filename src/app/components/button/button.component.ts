import { Component, Input } from '@angular/core';

@Component({
  selector: 'component-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() value!: string;
}
