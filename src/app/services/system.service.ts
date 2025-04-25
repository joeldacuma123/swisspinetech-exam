import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SystemService {

  constructor(private http: HttpClient) { }

  async getSystems() {
    return firstValueFrom(this.http.get<any>('http://localhost:1337/api/systems'));
  }
}
