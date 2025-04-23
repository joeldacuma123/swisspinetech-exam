import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() createButtonText = 'CREATE NEW EXTERNAL SYSTEM SET-UP';
  @Output() searchChange = new EventEmitter<string>();
  @Output() onCreate = new EventEmitter<void>();

  searchControl = new FormControl('');

  constructor() {
    this.searchControl.valueChanges.subscribe(value => {
      this.searchChange.emit(value || '');
    });
  }
}
