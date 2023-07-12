import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavComponent } from '@modules/shared/components/nav/nav.component';
import { TailwindDirective } from '@modules/shared/directives/tailwind.directive';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    NavComponent,
    TailwindDirective
  ],
  templateUrl: './dashboard-page.component.html'
})
export class DashboardPageComponent {

}
