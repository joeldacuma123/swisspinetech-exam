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

  constructor(private dialog: MatDialog) {}

  async ngOnInit() {
    await this.loadPlanners();
    await this.loadSystems();
  }

  async loadPlanners() {
    try {
      this.isLoading = true;
      const response = await this.plannerService.getPlanners();
      this.planners = response.data;
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

  onSearch(searchTerm: string) {
    this.filteredPlanners = this.planners.filter(planner =>
      planner.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  createNewPlanner() {
    this.selectedPlanner = null;
    this.plannerForm = createPlannerForm(this.formBuilder);
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
    planner.funds.forEach(fund => {
      fundsArray.push(this.formBuilder.group({
        fund: [fund.fund],
        alias: [fund.alias]
      }));
    });

    planner.sources.forEach(source => {
      sourcesArray.push(this.formBuilder.group({
        name: [source.name],
        value: [source.value]
      }));
    });

    planner.runs.forEach(run => {
      runsArray.push(this.formBuilder.group({
        name: [run.name],
        value: [run.value]
      }));
    });

    planner.reports.forEach(report => {
      reportsArray.push(this.formBuilder.group({
        name: [report.name],
        value: [report.value]
      }));
    });
  }

  selectPlanner(planner: IPlanner) {
    if (this.isSelecting || this.selectedPlanner?.id === planner.id) {
      return;
    }

    this.isSelecting = true;
    try {
      this.selectedPlanner = planner;
      this.plannerForm = createPlannerForm(this.formBuilder);
      
      // Patch basic form values
      this.plannerForm.patchValue({
        name: planner.name,
        description: planner.description,
        plannerType: planner.plannerType,
        externalSystemConfig: planner.externalSystemConfig,
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
    const funds = this.plannerForm.get('funds') as FormArray;
    funds.push(this.formBuilder.group({
      fund: [''],
      alias: ['']
    }));
  }

  addSource() {
    const sources = this.plannerForm.get('sources') as FormArray;
    sources.push(this.formBuilder.group({
      name: [''],
      value: ['']
    }));
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
        // await this.plannerService.createPlanner(this.plannerForm.value);
        await this.loadPlanners();
        this.plannerForm = createPlannerForm(this.formBuilder);
      } catch (error) {
        console.error('Error creating planner:', error);
      }
    }
  }

  async updatePlanner(planner: IPlanner) {
    if (this.plannerForm.valid && planner.id) {
      try {
        //await this.plannerService.updatePlanner(this.plannerForm.value, planner.id.toString());
        await this.loadPlanners();
      } catch (error) {
        console.error('Error updating planner:', error);
      }
    }
  }

  copyPlanner(planner: IPlanner) {
    const plannerData = { ...planner };
    delete plannerData.id;
    delete plannerData.documentId;
    this.selectPlanner(plannerData as IPlanner);
  }

  deletePlanner(planner: IPlanner) {
    console.log('Delete planner clicked', planner);
  }
}
