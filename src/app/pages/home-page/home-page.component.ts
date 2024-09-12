import { Component, inject, OnInit } from '@angular/core';
import { SideBarComponent } from '../../components/side-bar/side-bar.component';
import { InputComponent } from '../../components/input/input.component';
import { MainChatComponent } from '../../components/main-chat/main-chat.component';
import { CommonModule } from '@angular/common';
import { settingsService } from '../../services/setting.service';
import { theme } from '../../theme.enum';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [SideBarComponent, InputComponent, MainChatComponent, CommonModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  private settingsService = inject(settingsService);
  sideBarOpened = false;

  mode!: string;
  theme = theme;

  ngOnInit() {
    this.mode = this.settingsService.getMode();
    this.settingsService.mode$.subscribe((newMode) => {
      this.mode = newMode;
    });
  }

  openSideBar() {
    this.sideBarOpened = true;
  }

  closeSideBar() {
    this.sideBarOpened = false;
  }

  handleTapSelection() {
    this.closeSideBar();
  }

  handleNewChat() {
    this.closeSideBar();
  }

  handleConversationSelected() {
    // Close the sidebar when screen width is <= 600px
    if (window.innerWidth <= 600) {
      this.closeSideBar();
    }
  }
}
