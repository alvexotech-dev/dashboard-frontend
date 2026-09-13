import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response';
import { Mechanic } from '../models/mechanic';

@Injectable({ providedIn: 'root' })
export class MechanicService {
  constructor(private http: HttpClient) {}

  getMechanics(): Observable<Mechanic[]> {
    return this.http
      .get<ApiResponse<Mechanic[]>>(`${environment.apiUrl}/api/users/mechanics`)
      .pipe(map((response) => response.data));
  }
}
