import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PersonGraphComponent } from '@modules/dashboard/components/person-gragh/person-graph.component';
import { NavComponent } from '@modules/shared/components/nav/nav.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    NavComponent,
    PersonGraphComponent
  ],
  templateUrl: './dashboard-page.component.html'
})
export class DashboardPageComponent {

}
