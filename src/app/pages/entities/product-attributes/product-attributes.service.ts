import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { createRequestOption } from '../../../shared';
import { ProductAttributes } from './product-attributes.model';

@Injectable({ providedIn: 'root' })
export class ProductAttributesService {
  private resourceUrl = ApiService.API_URL + '/product-attributes';

  constructor(protected http: HttpClient) {}

  create(productAttributes: ProductAttributes): Observable<HttpResponse<ProductAttributes>> {
    return this.http.post<ProductAttributes>(this.resourceUrl, productAttributes, { observe: 'response' });
  }

  update(productAttributes: ProductAttributes): Observable<HttpResponse<ProductAttributes>> {
    return this.http.put(`${this.resourceUrl}/${productAttributes.id}`, productAttributes, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<ProductAttributes>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<ProductAttributes[]>> {
    const options = createRequestOption(req);
    return this.http.get<ProductAttributes[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
