import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { ConservationService } from '../../services/Conservation.service';
import { settingsService } from '../../services/setting.service';
import { theme } from '../../theme.enum';

interface ChatMessage {
  conservationId: string;
  sender: string;
  reciver: string;
  text: string;
  sendDate: number;
  imageUrl?: string | null;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnChanges {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  @Input() conservationId!: string; // Input for conservation ID

  messages$!: Observable<{ date: string; messages: ChatMessage[] }[]>;
  userEmail!: string;
  userRole!: string;
  loading: boolean = true;

  constructor(
    private conservationService: ConservationService,
    private settingsService: settingsService
  ) {}

  mode!: string;
  theme = theme;

  ngOnInit() {
    this.userEmail = sessionStorage.getItem('userEmail') || '';
    this.userRole = sessionStorage.getItem('userRole') || '';
    this.mode = this.settingsService.getMode();

    this.settingsService.mode$.subscribe((newMode) => {
      this.mode = newMode;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['conservationId'] && this.conservationId) {
      this.loadMessages(this.conservationId);
    }
  }

  private loadMessages(conservationId: string) {
    this.loading = true;

    // Get conservation by ID using the service
    this.conservationService
      .getConservationById(conservationId)
      .subscribe((conservation) => {
        if (conservation) {
          const messages = Object.values(
            conservation.messages
          ) as ChatMessage[];
          this.messages$ = this.groupMessagesByDate(messages);

          this.messages$.subscribe(() => {
            this.scrollToBottom();
            this.loading = false;
          });
        }
      });
  }

  private scrollToBottom(): void {
    try {
      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop =
          this.chatContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error(err);
    }
  }

  groupMessagesByDate(
    messages: ChatMessage[]
  ): Observable<{ date: string; messages: ChatMessage[] }[]> {
    // sort messages by sendDate
    const sortedMessages = messages.sort(
      (a, b) => new Date(a.sendDate).getTime() - new Date(b.sendDate).getTime()
    );

    // Group messages by date
    const grouped: { [key: string]: ChatMessage[] } = {};
    sortedMessages.forEach((message) => {
      const dateKey = this.messagesSentDay(new Date(message.sendDate));
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(message);
    });

    // Convert grouped object to array and sort it by date
    const sortedGroups = Object.keys(grouped)
      .map((date) => ({
        date,
        messages: grouped[date],
      }))
      .sort((a, b) => {
        const dateA = new Date(a.messages[0].sendDate);
        const dateB = new Date(b.messages[0].sendDate);
        return dateA.getTime() - dateB.getTime();
      });

    return new Observable((observer) => {
      observer.next(sortedGroups);
    });
  }

  messagesSentDay(date: Date): string {
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    const givenDate = new Date(date);
    givenDate.setHours(0, 0, 0, 0);

    const differenceInTime = today.getTime() - givenDate.getTime();
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));

    if (differenceInDays === 0) {
      return 'Today';
    } else if (differenceInDays === 1) {
      return 'Yesterday';
    } else if (differenceInDays > 1 && differenceInDays <= 7) {
      return `${differenceInDays} days ago`;
    } else {
      return givenDate.toLocaleDateString();
    }
  }
}
