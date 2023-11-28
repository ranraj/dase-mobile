import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { createRequestOption } from '../../../shared';
import { Company } from './company.model';

@Injectable({ providedIn: 'root' })
export class CompanyService {
  private resourceUrl = ApiService.API_URL + '/companies';

  constructor(protected http: HttpClient) {}

  create(company: Company): Observable<HttpResponse<Company>> {
    return this.http.post<Company>(this.resourceUrl, company, { observe: 'response' });
  }

  update(company: Company): Observable<HttpResponse<Company>> {
    return this.http.put(`${this.resourceUrl}/${company.id}`, company, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Company>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Company[]>> {
    const options = createRequestOption(req);
    return this.http.get<Company[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
