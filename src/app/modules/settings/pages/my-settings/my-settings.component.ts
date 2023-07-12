import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NavComponent } from '@modules/shared/components/nav/nav.component';
import { SvgIconDirective } from '@modules/shared/directives/svg-icon.directive';
import { TailwindDirective } from '@modules/shared/directives/tailwind.directive';

@Component({
  selector: 'app-my-settings',
  standalone: true,
  imports: [
    CommonModule,
    NavComponent,
    RouterLinkActive,
    RouterLink,
    RouterOutlet,
    SvgIconDirective,
    TailwindDirective
  ],
  templateUrl: './my-settings.component.html'
})
export class MySettingsComponent {

}
