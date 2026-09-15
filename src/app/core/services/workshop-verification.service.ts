import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response';
import { PagedResponse } from '../models/paged-response';
import { DirectoryQuery } from '../models/directory-query';
import {
  WorkshopVerificationDetail,
  WorkshopVerificationSummary,
  WorkshopVerificationType,
} from '../models/workshop-verification';

const BASE_URL = `${environment.apiUrl}/api/workshop-verifications`;

export interface VerificationQuery extends DirectoryQuery {
  type: WorkshopVerificationType | null;
}

@Injectable({ providedIn: 'root' })
export class WorkshopVerificationService {
  constructor(private http: HttpClient) {}

  getQueue(query: VerificationQuery): Observable<PagedResponse<WorkshopVerificationSummary>> {
    return this.list(`${BASE_URL}/queue`, query);
  }

  getAll(query: VerificationQuery): Observable<PagedResponse<WorkshopVerificationSummary>> {
    return this.list(BASE_URL, query);
  }

  getById(id: number): Observable<WorkshopVerificationDetail> {
    return this.http
      .get<ApiResponse<WorkshopVerificationDetail>>(`${BASE_URL}/${id}`)
      .pipe(map((response) => response.data));
  }

  approve(id: number): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${BASE_URL}/${id}/approve`, {}).pipe(map(() => void 0));
  }

  reject(id: number, reason: string): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${BASE_URL}/${id}/reject`, { reason }).pipe(map(() => void 0));
  }

  requestInfo(id: number, reason: string): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${BASE_URL}/${id}/request-info`, { reason }).pipe(map(() => void 0));
  }

  markResubmitted(id: number): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${BASE_URL}/${id}/mark-resubmitted`, {}).pipe(map(() => void 0));
  }

  private list(url: string, query: VerificationQuery): Observable<PagedResponse<WorkshopVerificationSummary>> {
    let params = new HttpParams()
      .set('page', query.page)
      .set('size', query.size)
      .set('search', query.search)
      .set('sortBy', query.sortBy)
      .set('sortDir', query.sortDir);
    if (query.type) {
      params = params.set('type', query.type);
    }

    return this.http
      .get<ApiResponse<PagedResponse<WorkshopVerificationSummary>>>(url, { params })
      .pipe(map((response) => response.data));
  }
}
