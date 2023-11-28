import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { createRequestOption } from '../../../shared';
import { PartyType } from './party-type.model';

@Injectable({ providedIn: 'root' })
export class PartyTypeService {
  private resourceUrl = ApiService.API_URL + '/party-types';

  constructor(protected http: HttpClient) {}

  create(partyType: PartyType): Observable<HttpResponse<PartyType>> {
    return this.http.post<PartyType>(this.resourceUrl, partyType, { observe: 'response' });
  }

  update(partyType: PartyType): Observable<HttpResponse<PartyType>> {
    return this.http.put(`${this.resourceUrl}/${partyType.id}`, partyType, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<PartyType>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<PartyType[]>> {
    const options = createRequestOption(req);
    return this.http.get<PartyType[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
