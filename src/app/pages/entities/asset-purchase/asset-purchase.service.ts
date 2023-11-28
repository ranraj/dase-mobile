import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { createRequestOption } from '../../../shared';
import { AssetPurchase } from './asset-purchase.model';

@Injectable({ providedIn: 'root' })
export class AssetPurchaseService {
  private resourceUrl = ApiService.API_URL + '/asset-purchases';

  constructor(protected http: HttpClient) {}

  create(assetPurchase: AssetPurchase): Observable<HttpResponse<AssetPurchase>> {
    return this.http.post<AssetPurchase>(this.resourceUrl, assetPurchase, { observe: 'response' });
  }

  update(assetPurchase: AssetPurchase): Observable<HttpResponse<AssetPurchase>> {
    return this.http.put(`${this.resourceUrl}/${assetPurchase.id}`, assetPurchase, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<AssetPurchase>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<AssetPurchase[]>> {
    const options = createRequestOption(req);
    return this.http.get<AssetPurchase[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
