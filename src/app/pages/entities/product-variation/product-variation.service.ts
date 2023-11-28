import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { createRequestOption } from '../../../shared';
import { ProductVariation } from './product-variation.model';

@Injectable({ providedIn: 'root' })
export class ProductVariationService {
  private resourceUrl = ApiService.API_URL + '/product-variations';

  constructor(protected http: HttpClient) {}

  create(productVariation: ProductVariation): Observable<HttpResponse<ProductVariation>> {
    return this.http.post<ProductVariation>(this.resourceUrl, productVariation, { observe: 'response' });
  }

  update(productVariation: ProductVariation): Observable<HttpResponse<ProductVariation>> {
    return this.http.put(`${this.resourceUrl}/${productVariation.id}`, productVariation, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<ProductVariation>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<ProductVariation[]>> {
    const options = createRequestOption(req);
    return this.http.get<ProductVariation[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
