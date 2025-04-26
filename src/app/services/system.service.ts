import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ISystem, ISystemsResponse } from '../models/system';

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
}
