import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { settingsService } from '../../services/setting.service';
import { ConservationService } from '../../services/Conservation.service';
import { theme } from '../../theme.enum';

@Component({
  selector: 'app-tap',
  standalone: true,
  templateUrl: './tap.component.html',
  styleUrls: ['./tap.component.css'],
  imports: [RouterModule, CommonModule],
})
export class TapComponent implements OnInit {
  @Input() title: string = '';
  @Input() ConvId: string = '';
  currentConvId: string = '';
  isDarkMode: boolean = false;

  @Output() tapSelected = new EventEmitter<void>();

  constructor(
    private route: ActivatedRoute,
    private settingsService: settingsService,
    private conservationService: ConservationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.currentConvId = params['ConvId'];
    });

    this.isDarkMode = this.settingsService.getMode() === theme.DARK;
  }

  isActive(): boolean {
    return this.ConvId === this.currentConvId;
  }

  async deleteConservation() {
    const confirmDelete = confirm('Delete this conversation?');

    if (confirmDelete) {
      if (this.isActive()) {
        await this.conservationService.deleteConservation(this.ConvId);
        this.router.navigate(['/home-page']); // Navigate to the default
      } else {
        await this.conservationService.deleteConservation(this.ConvId);
      }
    }
  }

  onTapClick() {
    this.tapSelected.emit();
  }
}
