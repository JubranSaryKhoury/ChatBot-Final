import { Component, OnInit, inject } from '@angular/core';
import { ConservationService } from '../../services/Conservation.service';
import { BlackSuggestionsComponent } from '../black-suggestions/black-suggestions.component';
import { WhiteSuggestionsComponent } from '../white-suggestions/white-suggestions.component';
import { ChatComponent } from '../chat/chat.component';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { settingsService } from '../../services/setting.service';
import { theme } from '../../theme.enum';

@Component({
  selector: 'app-main-chat',
  standalone: true,
  imports: [
    BlackSuggestionsComponent,
    WhiteSuggestionsComponent,
    ChatComponent,
    CommonModule,
  ],
  templateUrl: './main-chat.component.html',
  styleUrls: ['./main-chat.component.css'],
})
export class MainChatComponent implements OnInit {
  private conservationService = inject(ConservationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  mode!: string;
  theme = theme;

  constructor(private settingsService: settingsService) {}
  DisplayDefault$ = new BehaviorSubject<boolean>(true);
  conservationId: string | null = null; // Store conservation ID

  ngOnInit() {
    this.router.events.subscribe(() => {
      this.checkRoute();
    });

    // Initial check
    this.checkRoute();

    console.log('conservationID= ' + this.conservationId);
    this.mode = this.settingsService.getMode();

    this.settingsService.mode$.subscribe((newMode) => {
      this.mode = newMode;
    });
  }

  private checkRoute() {
    // Get the URL parameters and check if there's an ID
    const id = this.route.snapshot.paramMap.get('ConvId');

    if (id) {
      this.conservationId = id; // Set the ID for the chat component
      this.DisplayDefault$.next(false); // Show chat
    } else {
      this.DisplayDefault$.next(true); // Show default content
    }
  }
}
