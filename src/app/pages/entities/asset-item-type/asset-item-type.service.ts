import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { createRequestOption } from '../../../shared';
import { AssetItemType } from './asset-item-type.model';

@Injectable({ providedIn: 'root' })
export class AssetItemTypeService {
  private resourceUrl = ApiService.API_URL + '/asset-item-types';

  constructor(protected http: HttpClient) {}

  create(assetItemType: AssetItemType): Observable<HttpResponse<AssetItemType>> {
    return this.http.post<AssetItemType>(this.resourceUrl, assetItemType, { observe: 'response' });
  }

  update(assetItemType: AssetItemType): Observable<HttpResponse<AssetItemType>> {
    return this.http.put(`${this.resourceUrl}/${assetItemType.id}`, assetItemType, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<AssetItemType>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<AssetItemType[]>> {
    const options = createRequestOption(req);
    return this.http.get<AssetItemType[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
