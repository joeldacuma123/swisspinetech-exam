import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IPlannerResponse } from '../models/planner';
import { firstValueFrom } from 'rxjs';
import { IPlanner } from '../models/planner'
@Injectable({
  providedIn: 'root'
})
export class PlannerService {

  constructor(private http: HttpClient) { }

  async getPlanners(page = 1, pageSize = 10) {
    return firstValueFrom(this.http.get<IPlannerResponse>(
      `http://localhost:1337/api/planners?pagination[page]=${page}&pagination[pageSize]=${pageSize}`
    ));
  }

  async createPlanner(planner: IPlanner) {
    return firstValueFrom(this.http.post<IPlannerResponse>('http://localhost:1337/api/planners', { data: planner }));
  }

  async updatePlanner(planner: IPlanner, documentId: string) {
    return firstValueFrom(this.http.put<IPlannerResponse>(`http://localhost:1337/api/planners/${documentId}`, { data: planner }));
  }

  async deletePlanner(documentId: string) {
    return firstValueFrom(this.http.delete<IPlannerResponse>(`http://localhost:1337/api/planners/${documentId}`));
  }
}
