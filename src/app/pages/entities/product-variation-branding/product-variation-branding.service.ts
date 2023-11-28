import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { createRequestOption } from '../../../shared';
import { ProductVariationBranding } from './product-variation-branding.model';

@Injectable({ providedIn: 'root' })
export class ProductVariationBrandingService {
  private resourceUrl = ApiService.API_URL + '/product-variation-brandings';

  constructor(protected http: HttpClient) {}

  create(productVariationBranding: ProductVariationBranding): Observable<HttpResponse<ProductVariationBranding>> {
    return this.http.post<ProductVariationBranding>(this.resourceUrl, productVariationBranding, { observe: 'response' });
  }

  update(productVariationBranding: ProductVariationBranding): Observable<HttpResponse<ProductVariationBranding>> {
    return this.http.put(`${this.resourceUrl}/${productVariationBranding.id}`, productVariationBranding, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<ProductVariationBranding>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<ProductVariationBranding[]>> {
    const options = createRequestOption(req);
    return this.http.get<ProductVariationBranding[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
