import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ExternalSystemComponent } from './components/external-system/external-system.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ExternalSystemComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'swisspine-tech-test-exam';
}
