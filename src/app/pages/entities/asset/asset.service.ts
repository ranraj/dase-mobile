import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { createRequestOption } from '../../../shared';
import { Asset } from './asset.model';

@Injectable({ providedIn: 'root' })
export class AssetService {
  private resourceUrl = ApiService.API_URL + '/assets';
  private searchUrl = ApiService.API_URL + "/_search/assets"

  constructor(protected http: HttpClient) { }

  create(asset: Asset): Observable<HttpResponse<Asset>> {
    return this.http.post<Asset>(this.resourceUrl, asset, { observe: 'response' });
  }

  update(asset: Asset): Observable<HttpResponse<Asset>> {
    return this.http.put(`${this.resourceUrl}/${asset.id}`, asset, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Asset>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Asset[]>> {
    const options = createRequestOption(req);
    return this.http.get<Asset[]>(this.resourceUrl, { params: options, observe: 'response' });
  }
  searchQuery(req?: any): Observable<HttpResponse<Asset[]>> {
    return this.http.get<Asset[]>(this.searchUrl, { params: req, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
