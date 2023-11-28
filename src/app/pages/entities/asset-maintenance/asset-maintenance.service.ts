import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { createRequestOption } from '../../../shared';
import { AssetMaintenance } from './asset-maintenance.model';

@Injectable({ providedIn: 'root' })
export class AssetMaintenanceService {
  private resourceUrl = ApiService.API_URL + '/asset-maintenances';

  constructor(protected http: HttpClient) {}

  create(assetMaintenance: AssetMaintenance): Observable<HttpResponse<AssetMaintenance>> {
    return this.http.post<AssetMaintenance>(this.resourceUrl, assetMaintenance, { observe: 'response' });
  }

  update(assetMaintenance: AssetMaintenance): Observable<HttpResponse<AssetMaintenance>> {
    return this.http.put(`${this.resourceUrl}/${assetMaintenance.id}`, assetMaintenance, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<AssetMaintenance>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<AssetMaintenance[]>> {
    const options = createRequestOption(req);
    return this.http.get<AssetMaintenance[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
