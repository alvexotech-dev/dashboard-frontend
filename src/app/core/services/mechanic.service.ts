import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response';
import { PagedResponse } from '../models/paged-response';
import { DirectoryQuery } from '../models/directory-query';
import { Mechanic } from '../models/mechanic';

@Injectable({ providedIn: 'root' })
export class MechanicService {
  constructor(private http: HttpClient) {}

  getMechanics(query: DirectoryQuery): Observable<PagedResponse<Mechanic>> {
    const params = new HttpParams()
      .set('page', query.page)
      .set('size', query.size)
      .set('search', query.search)
      .set('sortBy', query.sortBy)
      .set('sortDir', query.sortDir);

    return this.http
      .get<ApiResponse<PagedResponse<Mechanic>>>(`${environment.apiUrl}/api/users/mechanics`, { params })
      .pipe(map((response) => response.data));
  }
}
