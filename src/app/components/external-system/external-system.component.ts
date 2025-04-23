import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HeaderComponent } from '../header/header.component';

interface ExternalSystem {
  name: string;
  isDefault: boolean;
  isExpanded?: boolean;
}

@Component({
  selector: 'app-external-system',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    HeaderComponent
  ],
  templateUrl: './external-system.component.html',
  styleUrls: ['./external-system.component.scss']
})
export class ExternalSystemComponent implements OnInit {
  systems: ExternalSystem[] = [
    { name: 'PrimeEquityPartners', isDefault: false },
    { name: 'Pauls test setup', isDefault: false }
  ];
  filteredSystems: ExternalSystem[] = [];

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    this.filteredSystems = [...this.systems];
  }

  onSearch(searchTerm: string) {
    this.filteredSystems = this.systems.filter(system =>
      system.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  createNewSystem() {
    // Implement create new system dialog
    console.log('Create new system clicked');
  }
}
