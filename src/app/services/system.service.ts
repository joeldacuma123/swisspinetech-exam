import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ISystem, ISystemsResponse } from '../models/system';
import { IPlannerResponse } from '../models/planner';

@Injectable({
  providedIn: 'root'
})
export class SystemService {

  constructor(private http: HttpClient) { }

  async getSystems() {
    return firstValueFrom(this.http.get<ISystemsResponse>('http://localhost:1337/api/systems'));
  }

  async createSystem(system: ISystem) {
    return firstValueFrom(this.http.post<any>('http://localhost:1337/api/systems', { data: system }));
  }

  async updateSystem(system: ISystem, documentId: string) {
    return firstValueFrom(this.http.put<any>(`http://localhost:1337/api/systems/${documentId}`, { data: system }));
  }

  async deleteSystem(documentId: string) {
    return firstValueFrom(this.http.delete<any>(`http://localhost:1337/api/systems/${documentId}`));
  }

  async getPlanners() {
    return firstValueFrom(this.http.get<IPlannerResponse>('http://localhost:1337/api/planners'));
  }
}
