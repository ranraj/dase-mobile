import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { createRequestOption } from '../../../shared';
import { Party } from './party.model';

@Injectable({ providedIn: 'root' })
export class PartyService {
  private resourceUrl = ApiService.API_URL + '/parties';

  constructor(protected http: HttpClient) {}

  create(party: Party): Observable<HttpResponse<Party>> {
    return this.http.post<Party>(this.resourceUrl, party, { observe: 'response' });
  }

  update(party: Party): Observable<HttpResponse<Party>> {
    return this.http.put(`${this.resourceUrl}/${party.id}`, party, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Party>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Party[]>> {
    const options = createRequestOption(req);
    return this.http.get<Party[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
