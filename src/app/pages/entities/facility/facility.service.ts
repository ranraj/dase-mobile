import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { createRequestOption } from '../../../shared';
import { Facility } from './facility.model';

@Injectable({ providedIn: 'root' })
export class FacilityService {
  private resourceUrl = ApiService.API_URL + '/facilities';

  constructor(protected http: HttpClient) {}

  create(facility: Facility): Observable<HttpResponse<Facility>> {
    return this.http.post<Facility>(this.resourceUrl, facility, { observe: 'response' });
  }

  update(facility: Facility): Observable<HttpResponse<Facility>> {
    return this.http.put(`${this.resourceUrl}/${facility.id}`, facility, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Facility>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Facility[]>> {
    const options = createRequestOption(req);
    return this.http.get<Facility[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
