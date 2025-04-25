import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ISystem } from '../models/system';

@Injectable({
  providedIn: 'root'
})
export class SystemService {

  constructor(private http: HttpClient) { }

  async getSystems() {
    return firstValueFrom(this.http.get<any>('http://localhost:1337/api/systems'));
  }

  async createSystem(system: ISystem) {
    return firstValueFrom(this.http.post<any>('http://localhost:1337/api/systems', system));
  }

  async updateSystem(system: ISystem) {
    return firstValueFrom(this.http.put<any>(`http://localhost:1337/api/systems/${system.id}`, system));
  }
}
