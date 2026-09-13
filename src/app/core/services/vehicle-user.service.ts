import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response';
import { VehicleUser } from '../models/vehicle-user';

@Injectable({ providedIn: 'root' })
export class VehicleUserService {
  constructor(private http: HttpClient) {}

  getVehicleUsers(): Observable<VehicleUser[]> {
    return this.http
      .get<ApiResponse<VehicleUser[]>>(`${environment.apiUrl}/api/users/vehicle-users`)
      .pipe(map((response) => response.data));
  }
}
