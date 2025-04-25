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

  systems: ISystem[] = [];
  filteredSystems: ISystem[] = [];
  systemForms: { [key: number]: FormGroup } = {};

  constructor(private dialog: MatDialog) {}

  async ngOnInit() {
    await this.loadSystems();
  }

  async loadSystems() {
    try {
      const response = await this.systemService.getSystems();
      this.systems = response.data;
      this.filteredSystems = [...this.systems];
      this.initializeSystemForms();
    } catch (error) {
      console.error('Error loading systems:', error);
    }
  }

  initializeSystemForms() {
    this.systems.forEach(system => {
      if (system.id) {
        this.systemForms[system.id] = this.formBuilder.group({
          name: [system.name],
          baseUrl: [system.baseUrl],
          authenticationMethod: [system.authenticationMethod],
          authenticationPlace: [system.authenticationPlace],
          key: [system.key],
          value: [system.value]
        });
      }
    });
  }

  onSearch(searchTerm: string) {
    this.filteredSystems = this.systems.filter(system =>
      system.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  async createNewSystem() {
    if (this.systemForm.valid) {
      try {
        const newSystem = this.systemForm.value;
        await this.systemService.createSystem(newSystem);
        await this.loadSystems(); // Reload the systems after creating a new one
        this.systemForm.reset();
      } catch (error) {
        console.error('Error creating system:', error);
      }
    }
  }

  async updateSystem(systemId: number) {
    const form = this.systemForms[systemId];
    if (form && form.valid) {
      try {
        const updatedSystem = { ...form.value, id: systemId };
        await this.systemService.updateSystem(updatedSystem);
        await this.loadSystems();
      } catch (error) {
        console.error('Error updating system:', error);
      }
    }
  }

  copySystem(system: ISystem) {
    console.log('Copy system clicked', system);
  }

  deleteSystem(system: ISystem) {
    console.log('Delete system clicked', system);
  }
}
