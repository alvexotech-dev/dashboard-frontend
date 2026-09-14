import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response';
import { PagedResponse } from '../models/paged-response';
import { DirectoryQuery } from '../models/directory-query';
import { VehicleUser } from '../models/vehicle-user';

@Injectable({ providedIn: 'root' })
export class VehicleUserService {
  constructor(private http: HttpClient) {}

  getVehicleUsers(query: DirectoryQuery): Observable<PagedResponse<VehicleUser>> {
    const params = new HttpParams()
      .set('page', query.page)
      .set('size', query.size)
      .set('search', query.search)
      .set('sortBy', query.sortBy)
      .set('sortDir', query.sortDir);

    return this.http
      .get<ApiResponse<PagedResponse<VehicleUser>>>(`${environment.apiUrl}/api/users/vehicle-users`, { params })
      .pipe(map((response) => response.data));
  }
}
