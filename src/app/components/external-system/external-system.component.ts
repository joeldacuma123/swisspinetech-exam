import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { HeaderComponent } from '../header/header.component';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { SystemService } from '../../services/system.service';
import { HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { AUTHENTICATION_METHODS } from '../../constants';
import { ISystem, ISystemsResponse, SystemForm } from '../../models/system';

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
    MatRadioModule,
    HeaderComponent,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSelectModule,
  ],
  templateUrl: './external-system.component.html',
  styleUrls: ['./external-system.component.scss']
})
export class ExternalSystemComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  systemForm: FormGroup = this.formBuilder.group(SystemForm);
  authenticationMethods = AUTHENTICATION_METHODS;
  systemService = inject(SystemService);

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
    console.log('Create new system clicked');
  }

  copySystem(system: ExternalSystem) {
    console.log('Copy system clicked', system);
  }

  deleteSystem(system: ExternalSystem) {
    console.log('Delete system clicked', system);
  }
}
