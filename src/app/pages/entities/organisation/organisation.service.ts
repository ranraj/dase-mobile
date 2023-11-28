import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { createRequestOption } from '../../../shared';
import { Organisation } from './organisation.model';

@Injectable({ providedIn: 'root' })
export class OrganisationService {
  private resourceUrl = ApiService.API_URL + '/organisations';

  constructor(protected http: HttpClient) {}

  create(organisation: Organisation): Observable<HttpResponse<Organisation>> {
    return this.http.post<Organisation>(this.resourceUrl, organisation, { observe: 'response' });
  }

  update(organisation: Organisation): Observable<HttpResponse<Organisation>> {
    return this.http.put(`${this.resourceUrl}/${organisation.id}`, organisation, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Organisation>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Organisation[]>> {
    const options = createRequestOption(req);
    return this.http.get<Organisation[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
