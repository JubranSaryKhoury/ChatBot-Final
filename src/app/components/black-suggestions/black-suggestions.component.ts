import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-black-suggestions',
  standalone: true,
  imports: [],
  templateUrl: './black-suggestions.component.html',
  styleUrl: './black-suggestions.component.css',
})
export class BlackSuggestionsComponent {
  @Input() imgSrc: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
}
