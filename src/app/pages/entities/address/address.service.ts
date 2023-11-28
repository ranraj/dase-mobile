import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { createRequestOption } from '../../../shared';
import { Address } from './address.model';

@Injectable({ providedIn: 'root' })
export class AddressService {
  private resourceUrl = ApiService.API_URL + '/addresses';

  constructor(protected http: HttpClient) {}

  create(address: Address): Observable<HttpResponse<Address>> {
    return this.http.post<Address>(this.resourceUrl, address, { observe: 'response' });
  }

  update(address: Address): Observable<HttpResponse<Address>> {
    return this.http.put(`${this.resourceUrl}/${address.id}`, address, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Address>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Address[]>> {
    const options = createRequestOption(req);
    return this.http.get<Address[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
