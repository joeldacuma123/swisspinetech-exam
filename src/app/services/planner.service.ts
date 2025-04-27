import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IPlannerResponse } from '../models/planner';
import { firstValueFrom } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PlannerService {

  constructor(private http: HttpClient) { }

  async getPlanners() {
    return firstValueFrom(this.http.get<IPlannerResponse>('http://localhost:1337/api/planners'));
  }
}
