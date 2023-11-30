import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { createRequestOption } from '../../../shared';
import { AssetItem } from './asset-item.model';

@Injectable({ providedIn: 'root' })
export class AssetItemService {
  private resourceUrl = ApiService.API_URL + '/asset-items';
  private searchUrl = ApiService.API_URL + "/_search/asset-items"
  constructor(protected http: HttpClient) { }

  create(assetItem: AssetItem): Observable<HttpResponse<AssetItem>> {
    return this.http.post<AssetItem>(this.resourceUrl, assetItem, { observe: 'response' });
  }

  update(assetItem: AssetItem): Observable<HttpResponse<AssetItem>> {
    return this.http.put(`${this.resourceUrl}/${assetItem.id}`, assetItem, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<AssetItem>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
  query(req?: any): Observable<HttpResponse<AssetItem[]>> {
    const options = createRequestOption(req);
    return this.http.get<AssetItem[]>(this.resourceUrl, { params: req, observe: 'response' });
  }
  searchQuery(req?: any): Observable<HttpResponse<AssetItem[]>> {
    return this.http.get<AssetItem[]>(this.searchUrl, { params: req, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
