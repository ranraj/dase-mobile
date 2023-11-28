import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { createRequestOption } from '../../../shared';
import { ProductBranding } from './product-branding.model';

@Injectable({ providedIn: 'root' })
export class ProductBrandingService {
  private resourceUrl = ApiService.API_URL + '/product-brandings';

  constructor(protected http: HttpClient) {}

  create(productBranding: ProductBranding): Observable<HttpResponse<ProductBranding>> {
    return this.http.post<ProductBranding>(this.resourceUrl, productBranding, { observe: 'response' });
  }

  update(productBranding: ProductBranding): Observable<HttpResponse<ProductBranding>> {
    return this.http.put(`${this.resourceUrl}/${productBranding.id}`, productBranding, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<ProductBranding>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<ProductBranding[]>> {
    const options = createRequestOption(req);
    return this.http.get<ProductBranding[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
