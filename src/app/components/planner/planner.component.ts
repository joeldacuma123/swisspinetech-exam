import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpClientModule } from '@angular/common/http';
import { PlannerHeaderComponent } from '../header/planner-header.component';
import { PLANNER_TYPES, FUND_TYPES, FUND_ALIAS_TYPES, SOURCE_TYPES, RUN_TYPES, REPORT_TYPES } from '../../constants';
import { SystemService } from '../../services/system.service';
import { ISystem } from '../../models/system';
interface Planner {
  name: string;
  isDefault: boolean;
  isExpanded?: boolean;
}

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
  planners: Planner[] = [
    { name: 'Planner 1', isDefault: false },
    { name: 'Planner 2', isDefault: false }
  ];
  plannerTypes = PLANNER_TYPES;
  fundTypes = FUND_TYPES;
  fundAliasTypes = FUND_ALIAS_TYPES;
  sourceTypes = SOURCE_TYPES;
  runTypes = RUN_TYPES;
  reportTypes = REPORT_TYPES;
  systemService = inject(SystemService);
  filteredPlanners: Planner[] = [];
  systems: ISystem[] = [];
  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    this.filteredPlanners = [...this.planners];
    this.systemService.getSystems().then((systems) => {
      this.systems = systems.data;
    });
  }

  onSearch(searchTerm: string) {
    this.filteredPlanners = this.planners.filter(planner =>
      planner.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  createNewPlanner() {
    console.log('Create new planner clicked');
  }

  copyPlanner(planner: Planner) {
    console.log('Copy planner clicked', planner);
  }

  deletePlanner(planner: Planner) {
    console.log('Delete planner clicked', planner);
  }
}
