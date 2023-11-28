import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { createRequestOption } from '../../../shared';
import { Catalog } from './catalog.model';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private resourceUrl = ApiService.API_URL + '/catalogs';

  constructor(protected http: HttpClient) {}

  create(catalog: Catalog): Observable<HttpResponse<Catalog>> {
    return this.http.post<Catalog>(this.resourceUrl, catalog, { observe: 'response' });
  }

  update(catalog: Catalog): Observable<HttpResponse<Catalog>> {
    return this.http.put(`${this.resourceUrl}/${catalog.id}`, catalog, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Catalog>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Catalog[]>> {
    const options = createRequestOption(req);
    return this.http.get<Catalog[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
