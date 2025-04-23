import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-sidemenu',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './sidemenu.component.html',
  styleUrl: './sidemenu.component.scss'
})
export class SidemenuComponent {
  menuItems = [
    { 
      icon: 'settings', 
      label: 'External System', 
      route: '/external' 
    },
    { 
      icon: 'dashboard', 
      label: 'Planner', 
      route: '/planner' 
    }
  ];
}
