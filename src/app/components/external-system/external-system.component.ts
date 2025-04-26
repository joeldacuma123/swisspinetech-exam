import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { HeaderComponent } from '../header/header.component';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SystemService } from '../../services/system.service';
import { HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { AUTHENTICATION_METHODS } from '../../constants';
import { ISystem, ISystemsResponse, SystemForm } from '../../models/system';

interface SystemWithTempId extends ISystem {
  tempId: number;
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
  private cdr = inject(ChangeDetectorRef);
  isLoading = false;

  systems: SystemWithTempId[] = [];
  filteredSystems: SystemWithTempId[] = [];
  systemForms: { [key: number]: FormGroup } = {};

  constructor(private dialog: MatDialog) {}

  async ngOnInit() {
    await this.loadSystems();
  }

  async loadSystems() {
    try {
      this.isLoading = true;
      const response = await this.systemService.getSystems();
      this.systems = response.data.map((system: ISystem) => ({
        ...system,
        tempId: system.id || Date.now()
      }));
      this.filteredSystems = [...this.systems];
      this.initializeSystemForms();
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading systems:', error);
    } finally {
      this.isLoading = false;
    }
  }

  initializeSystemForms() {
    this.systems.forEach(system => {
      this.systemForms[system.tempId] = this.formBuilder.group({
        name: [system.name],
        baseUrl: [system.baseUrl],
        authenticationMethod: [system.authenticationMethod],
        authenticationPlace: [system.authenticationPlace],
        key: [system.key],
        value: [system.value]
      });
    });
  }

  onSearch(searchTerm: string) {
    this.filteredSystems = this.systems.filter(system =>
      system.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  createNewSystem() {
    const tempId = Date.now();
    const newSystem: SystemWithTempId = {
      name: '',
      baseUrl: '',
      authenticationMethod: this.authenticationMethods[0]?.value || '',
      authenticationPlace: 'header',
      key: '',
      value: '',
      tempId: tempId
    };
    
    this.systems.push(newSystem);
    this.filteredSystems = [...this.systems];
    
    this.systemForms[tempId] = this.formBuilder.group({
      name: ['', Validators.required],
      baseUrl: ['', Validators.required],
      authenticationMethod: [this.authenticationMethods[0]?.value || '', Validators.required],
      authenticationPlace: ['header', Validators.required],
      key: ['', Validators.required],
      value: ['', Validators.required]
    });
    
    setTimeout(() => {
      this.cdr.detectChanges();
    });
  }

  async saveNewSystem(tempId: number) {
    const form = this.systemForms[tempId];
    if (form && form.valid) {
      try {
        const newSystem = form.value;
        await this.systemService.createSystem(newSystem);
        await this.loadSystems();
        delete this.systemForms[tempId];
        this.cdr.detectChanges();
      } catch (error) {
        console.error('Error creating system:', error);
      }
    }
  }

  async updateSystem(tempId: number) {
    const form = this.systemForms[tempId];
    if (form && form.valid) {
      try {
        const system = this.systems.find(s => s.tempId === tempId);
        if (system?.id) {
          console.log('Updating system', system);
          const updatedSystem = { ...form.value };
          await this.systemService.updateSystem(updatedSystem, system?.documentId?.toString() || '');
          await this.loadSystems();
          this.cdr.detectChanges();
        }
      } catch (error) {
        console.error('Error updating system:', error);
      }
    }
  }

  copySystem(system: SystemWithTempId) {
    console.log('Copy system clicked', system);
  }

  deleteSystem(system: SystemWithTempId) {
    this.systemService.deleteSystem(system.documentId?.toString() || '');
    this.loadSystems();
  }
}
