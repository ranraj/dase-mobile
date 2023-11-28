import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { createRequestOption } from '../../../shared';
import { Tax } from './tax.model';

@Injectable({ providedIn: 'root' })
export class TaxService {
  private resourceUrl = ApiService.API_URL + '/taxes';

  constructor(protected http: HttpClient) {}

  create(tax: Tax): Observable<HttpResponse<Tax>> {
    return this.http.post<Tax>(this.resourceUrl, tax, { observe: 'response' });
  }

  update(tax: Tax): Observable<HttpResponse<Tax>> {
    return this.http.put(`${this.resourceUrl}/${tax.id}`, tax, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Tax>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Tax[]>> {
    const options = createRequestOption(req);
    return this.http.get<Tax[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
