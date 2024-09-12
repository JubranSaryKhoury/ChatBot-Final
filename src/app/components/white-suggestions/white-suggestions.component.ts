import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-white-suggestions',
  standalone: true,
  imports: [],
  templateUrl: './white-suggestions.component.html',
  styleUrl: './white-suggestions.component.css',
})
export class WhiteSuggestionsComponent {
  @Input() imgSrc: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
}
