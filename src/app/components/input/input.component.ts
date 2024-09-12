import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConservationService } from '../../services/Conservation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { settingsService } from '../../services/setting.service';
import { theme } from '../../theme.enum';
import { firstValueFrom } from 'rxjs';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from '@angular/fire/storage';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
})
export class InputComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  newMessage: string = '';
  userEmail!: string;
  userRole!: string;
  conservationId!: string | null;
  mode!: string;
  theme = theme;

  selectedImage: string | null = null;
  selectedFile: File | null = null;

  constructor(
    private conservationService: ConservationService,
    private route: ActivatedRoute,
    private router: Router,
    private settingsService: settingsService,
    private storage: Storage
  ) {
    this.userEmail = sessionStorage.getItem('userEmail') || '';
    this.userRole = sessionStorage.getItem('userRole') || '';
  }

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.checkRoute();
    });

    this.checkRoute();

    this.mode = this.settingsService.getMode();

    this.settingsService.mode$.subscribe((newMode) => {
      this.mode = newMode;
    });
  }

  // Opens the file explorer
  openFileBrowser() {
    this.fileInput.nativeElement.click();
  }

  private async checkRoute() {
    const convId = this.route.snapshot.paramMap.get('ConvId');

    if (convId) {
      // If there's a convId in the URL, use the existing conversation
      this.conservationId = convId;
      console.log('Using existing conversation with ID:', this.conservationId);
    } else if (this.userRole === 'user') {
      // If the URL is /home-page and the role is user, create a new conversation
      console.log('new chat --- default');
    }
  }

  // private async createNewConversation(message: {
  //   sender: string;
  //   reciver: string;
  //   text: string;
  //   sendDate: string;
  // }): Promise<string> {
  //   const newConservationId =
  //     await this.conservationService.createNewConservation(message);
  //   this.conservationService.setFirstMessageStatus(false);

  //   return newConservationId;
  // }

  async sendMessage() {
    if (!this.newMessage.trim() && !this.selectedFile) {
      console.log('Empty message, not sending');
      return;
    }

    let imageUrl: string | undefined;

    // If there's an image, upload it to Firebase
    if (this.selectedFile) {
      const filePath = `images/${Date.now()}_${this.selectedFile.name}`;
      const storageRef = ref(this.storage, filePath);

      try {
        const snapshot = await uploadBytes(storageRef, this.selectedFile);
        imageUrl = await getDownloadURL(snapshot.ref);
        console.log('Image uploaded successfully:', imageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }

    const message = {
      sender: this.userEmail,
      reciver: 'chat@gmail.com',
      text: this.newMessage,
      sendDate: new Date(Date.now()).toLocaleString(),
      imageUrl: imageUrl || null, // Attach imageUrl if available, else null
    };

    // Check user role and send the message
    if (this.userRole === 'chat') {
      // Get conversation ID
      const convId = this.conservationId ?? '';

      if (!convId) {
        console.log('No conversation ID found');
        return;
      }

      await this.conservationService.sendMessage(convId, message);
      this.conservationService.modifyDate(convId);
    } else if (this.userRole === 'user') {
      if (!this.conservationId) {
        console.log('First message, creating new conversation');
        this.conservationId =
          await this.conservationService.createNewConservation(message);
        this.router.navigate(['home-page', this.conservationId]);
      } else {
        await this.conservationService.sendMessage(
          this.conservationId,
          message
        );
        this.conservationService.modifyDate(this.conservationId);
      }
    }
    this.newMessage = '';
    this.removeImage();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFile = file;

      // Display image preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.selectedImage = null;
    this.selectedFile = null;
    this.fileInput.nativeElement.value = '';
  }
}
