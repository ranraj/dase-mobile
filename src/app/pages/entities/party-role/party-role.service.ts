import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { createRequestOption } from '../../../shared';
import { PartyRole } from './party-role.model';

@Injectable({ providedIn: 'root' })
export class PartyRoleService {
  private resourceUrl = ApiService.API_URL + '/party-roles';

  constructor(protected http: HttpClient) {}

  create(partyRole: PartyRole): Observable<HttpResponse<PartyRole>> {
    return this.http.post<PartyRole>(this.resourceUrl, partyRole, { observe: 'response' });
  }

  update(partyRole: PartyRole): Observable<HttpResponse<PartyRole>> {
    return this.http.put(`${this.resourceUrl}/${partyRole.id}`, partyRole, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<PartyRole>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<PartyRole[]>> {
    const options = createRequestOption(req);
    return this.http.get<PartyRole[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
