import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpClientModule } from '@angular/common/http';
import { PlannerHeaderComponent } from '../header/planner-header.component';
import { PLANNER_TYPES, FUND_TYPES, FUND_ALIAS_TYPES, SOURCE_TYPES, RUN_TYPES, REPORT_TYPES } from '../../constants';
import { SystemService } from '../../services/system.service';
import { PlannerService } from '../../services/planner.service';
import { ISystem } from '../../models/system';
import { createPlannerForm, IPlanner } from '../../models/planner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-planner',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatCheckboxModule,
    HttpClientModule,
    PlannerHeaderComponent,
    MatPaginatorModule,
  ],
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.scss']
})
export class PlannerComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  plannerForm: FormGroup = createPlannerForm(this.formBuilder);
  plannerService = inject(PlannerService);
  systemService = inject(SystemService);
  private cdr = inject(ChangeDetectorRef);
  isLoading = false;

  get fundsArray() {
    return this.plannerForm.get('funds') as FormArray;
  }

  get sourcesArray() {
    return this.plannerForm.get('sources') as FormArray;
  }

  get runsArray() {
    return this.plannerForm.get('runs') as FormArray;
  }

  get reportsArray() {
    return this.plannerForm.get('reports') as FormArray;
  }

  planners: IPlanner[] = [];
  plannerTypes = PLANNER_TYPES;
  fundTypes = FUND_TYPES;
  fundAliasTypes = FUND_ALIAS_TYPES;
  sourceTypes = SOURCE_TYPES;
  runTypes = RUN_TYPES;
  reportTypes = REPORT_TYPES;
  filteredPlanners: IPlanner[] = [];
  systems: ISystem[] = [];
  selectedPlanner: IPlanner | null = null;
  private isSelecting = false;
  private selectionTimeout: any;
  private expandedPanels: Set<number> = new Set();
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  totalPlanners = 0;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  async ngOnInit() {
    await this.loadPlanners();
    await this.loadSystems();
  }

  async loadPlanners() {
    try {
      this.isLoading = true;
      const response = await this.plannerService.getPlanners(this.pageIndex + 1, this.pageSize);
      this.planners = response.data;
      this.totalPlanners = response.meta.pagination.total;
      this.filteredPlanners = [...this.planners];
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading planners:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async loadSystems() {
    try {
      const response = await this.systemService.getSystems();
      this.systems = response.data;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading systems:', error);
    }
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadPlanners();
  }

  private updatePaginatedPlanners() {
    this.filteredPlanners = [...this.planners];
  }

  onSearch(searchTerm: string) {
    if (!searchTerm) {
      this.loadPlanners();
      return;
    }
    
    this.filteredPlanners = this.planners.filter(planner => 
      planner.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  createNewPlanner() {
    const newPlanner: IPlanner = {
      name: '',
      description: '',
      plannerType: '',
      externalSystemConfig: null,
      funds: [],
      trigger: {
        sources: false,
        runs: false,
        reports: false
      },
      sources: [],
      runs: [],
      reports: []
    };
    
    this.selectedPlanner = newPlanner;
    this.plannerForm = createPlannerForm(this.formBuilder);
    this.filteredPlanners = [...this.filteredPlanners, newPlanner];
  }

  onAccordionOpened(planner: IPlanner) {
    if (!planner.id) {
      return;
    }

    if (this.expandedPanels.has(planner.id)) {
      return;
    }

    if (this.selectionTimeout) {
      clearTimeout(this.selectionTimeout);
    }
    
    this.selectionTimeout = setTimeout(() => {
      this.selectPlanner(planner);
      if (planner.id) {
        this.expandedPanels.add(planner.id);
      }
    }, 100);
  }

  onAccordionClosed(planner: IPlanner) {
    if (planner.id) {
      this.expandedPanels.delete(planner.id);
    }
  }

  private initializeFormArrays(planner: IPlanner) {
    const fundsArray = this.plannerForm.get('funds') as FormArray;
    const sourcesArray = this.plannerForm.get('sources') as FormArray;
    const runsArray = this.plannerForm.get('runs') as FormArray;
    const reportsArray = this.plannerForm.get('reports') as FormArray;

    // Clear existing arrays
    fundsArray.clear();
    sourcesArray.clear();
    runsArray.clear();
    reportsArray.clear();

    // Add new items
    if (planner.funds && Array.isArray(planner.funds)) {
      planner.funds.forEach(fund => {
        fundsArray.push(this.formBuilder.group({
          fund: [fund.fund || ''],
          alias: [fund.alias || '']
        }));
      });
    }

    if (planner.sources && Array.isArray(planner.sources)) {
      planner.sources.forEach(source => {
        sourcesArray.push(this.formBuilder.group({
          name: [source.name || ''],
          value: [source.value || '']
        }));
      });
    }

    if (planner.runs && Array.isArray(planner.runs)) {
      planner.runs.forEach(run => {
        runsArray.push(this.formBuilder.group({
          name: [run.name || ''],
          value: [run.value || '']
        }));
      });
    }

    if (planner.reports && Array.isArray(planner.reports)) {
      planner.reports.forEach(report => {
        reportsArray.push(this.formBuilder.group({
          name: [report.name || ''],
          value: [report.value || '']
        }));
      });
    }
  }

  selectPlanner(planner: IPlanner) {
    if (this.isSelecting || this.selectedPlanner?.id === planner.id) {
      return;
    }

    this.isSelecting = true;
    try {
      this.selectedPlanner = planner;
      this.plannerForm = createPlannerForm(this.formBuilder);
      const selectedPlannerType = this.plannerTypes.find(type => type.value === planner.plannerType);    
      const selectedSystem = this.systems.find(system => system.id === planner.externalSystemConfig?.id);
      
      // Patch basic form values
      this.plannerForm.patchValue({
        name: planner.name,
        description: planner.description,
        plannerType: selectedPlannerType?.value || '',
        externalSystemConfig: selectedSystem || null,
        trigger: {
          sources: planner.trigger.sources,
          runs: planner.trigger.runs,
          reports: planner.trigger.reports
        }
      });

      // Initialize form arrays
      this.initializeFormArrays(planner);
    } finally {
      this.isSelecting = false;
    }
  }

  addFund() {
    try {
      const funds = this.plannerForm.get('funds') as FormArray;
      if (!funds) {
        console.error('Funds form array not found');
        return;
      }
      
      funds.push(this.formBuilder.group({
        fund: ['', Validators.required],
        alias: ['', Validators.required]
      }));
      
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error adding fund:', error);
    }
  }

  addSource() {
    try {
      const sources = this.plannerForm.get('sources') as FormArray;
      if (!sources) {
        console.error('Sources form array not found');
        return;
      }
      
      sources.push(this.formBuilder.group({
        name: [''],
        value: ['']
      }));
      
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error adding source:', error);
    }
  }

  removeSource() {
    const sources = this.plannerForm.get('sources') as FormArray;
    if (sources.length > 0) {
      sources.removeAt(sources.length - 1);
    }
  }

  addRun() {
    const runs = this.plannerForm.get('runs') as FormArray;
    runs.push(this.formBuilder.group({
      name: [''],
      value: ['']
    }));
  }

  removeRun() {
    const runs = this.plannerForm.get('runs') as FormArray;
    if (runs.length > 0) {
      runs.removeAt(runs.length - 1);
    }
  }

  addReport() {
    const reports = this.plannerForm.get('reports') as FormArray;
    reports.push(this.formBuilder.group({
      name: [''],
      value: ['']
    }));
  }

  removeReport() {
    const reports = this.plannerForm.get('reports') as FormArray;
    if (reports.length > 0) {
      reports.removeAt(reports.length - 1);
    }
  }

  async saveNewPlanner() {
    if (this.plannerForm.valid) {
      try {
        await this.plannerService.createPlanner(this.plannerForm.value);
        await this.loadPlanners();
        this.plannerForm = createPlannerForm(this.formBuilder);
      } catch (error) {
        console.error('Error creating planner:', error);
      }
    }
  }

  async updatePlanner(planner: IPlanner) {
    if (this.plannerForm.valid && planner.documentId) {
      try {
        await this.plannerService.updatePlanner(this.plannerForm.value, planner.documentId.toString());
        await this.loadPlanners();
      } catch (error) {
        console.error('Error updating planner:', error);
      }
    }
  }

  copyPlanner(planner: IPlanner) {
    const plannerData = {
      name: planner.name,
      description: planner.description,
      plannerType: planner.plannerType,
      externalSystemConfig: planner.externalSystemConfig,
      funds: planner.funds,
      trigger: planner.trigger,
      sources: planner.sources,
      runs: planner.runs,
      reports: planner.reports
    };
    
    const jsonString = JSON.stringify(plannerData, null, 2);
    navigator.clipboard.writeText(jsonString).then(() => {
      this.snackBar.open('Planner data copied to clipboard', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
    }).catch(err => {
      this.snackBar.open('Failed to copy planner data', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
      console.error('Failed to copy planner data:', err);
    });
  }

  deletePlanner(planner: IPlanner) {
    if (planner.documentId) {
      try {
        this.plannerService.deletePlanner(planner.documentId.toString()).then(() => {
          this.loadPlanners();
          if (this.selectedPlanner?.documentId === planner.documentId) {
            this.selectedPlanner = null;
            this.plannerForm = createPlannerForm(this.formBuilder);
          }
        });
      } catch (error) {
        console.error('Error deleting planner:', error);
      }
    }
  }

  async submitPlanner(planner: IPlanner) {
    if (this.plannerForm.valid) {
      try {
        if (planner.id) {
          await this.updatePlanner(planner);
        } else {
          await this.saveNewPlanner();
        }
      } catch (error) {
        console.error('Error submitting planner:', error);
      }
    }
  }
}
