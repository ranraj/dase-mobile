import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { createRequestOption } from '../../../shared';
import { AssetServiceHistory } from './asset-service-history.model';

@Injectable({ providedIn: 'root' })
export class AssetServiceHistoryService {
  private resourceUrl = ApiService.API_URL + '/asset-service-histories';

  constructor(protected http: HttpClient) {}

  create(assetServiceHistory: AssetServiceHistory): Observable<HttpResponse<AssetServiceHistory>> {
    return this.http.post<AssetServiceHistory>(this.resourceUrl, assetServiceHistory, { observe: 'response' });
  }

  update(assetServiceHistory: AssetServiceHistory): Observable<HttpResponse<AssetServiceHistory>> {
    return this.http.put(`${this.resourceUrl}/${assetServiceHistory.id}`, assetServiceHistory, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<AssetServiceHistory>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<AssetServiceHistory[]>> {
    const options = createRequestOption(req);
    return this.http.get<AssetServiceHistory[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
