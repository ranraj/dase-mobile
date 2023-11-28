import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { createRequestOption } from '../../../shared';
import { TaxSplit } from './tax-split.model';

@Injectable({ providedIn: 'root' })
export class TaxSplitService {
  private resourceUrl = ApiService.API_URL + '/tax-splits';

  constructor(protected http: HttpClient) {}

  create(taxSplit: TaxSplit): Observable<HttpResponse<TaxSplit>> {
    return this.http.post<TaxSplit>(this.resourceUrl, taxSplit, { observe: 'response' });
  }

  update(taxSplit: TaxSplit): Observable<HttpResponse<TaxSplit>> {
    return this.http.put(`${this.resourceUrl}/${taxSplit.id}`, taxSplit, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<TaxSplit>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<TaxSplit[]>> {
    const options = createRequestOption(req);
    return this.http.get<TaxSplit[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
