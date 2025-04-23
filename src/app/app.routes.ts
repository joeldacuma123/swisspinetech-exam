import { Routes } from '@angular/router';
import { ExternalSystemComponent } from './components/external-system/external-system.component';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'dashboard', 
    pathMatch: 'full' 
  },
  { 
    path: 'external', 
    component: ExternalSystemComponent 
  },
  { 
    path: 'planner', 
    component: ExternalSystemComponent 
  },
];
