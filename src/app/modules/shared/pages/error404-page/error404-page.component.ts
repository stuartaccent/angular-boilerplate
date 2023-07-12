import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { TailwindDirective } from '@modules/shared/directives/tailwind.directive';

@Component({
  selector: 'app-error404-page',
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    TailwindDirective
  ],
  templateUrl: './error404-page.component.html'
})
export class Error404PageComponent {

}
