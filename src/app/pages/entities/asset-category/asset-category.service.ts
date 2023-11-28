import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { createRequestOption } from '../../../shared';
import { AssetCategory } from './asset-category.model';

@Injectable({ providedIn: 'root' })
export class AssetCategoryService {
  private resourceUrl = ApiService.API_URL + '/asset-categories';

  constructor(protected http: HttpClient) {}

  create(assetCategory: AssetCategory): Observable<HttpResponse<AssetCategory>> {
    return this.http.post<AssetCategory>(this.resourceUrl, assetCategory, { observe: 'response' });
  }

  update(assetCategory: AssetCategory): Observable<HttpResponse<AssetCategory>> {
    return this.http.put(`${this.resourceUrl}/${assetCategory.id}`, assetCategory, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<AssetCategory>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<AssetCategory[]>> {
    const options = createRequestOption(req);
    return this.http.get<AssetCategory[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
