import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  apiUrl = 'assets/suppliers.json'

  constructor(private http: HttpClient) { }

  getSuppliers(): Observable<any> {
    console.log('suppliers', this.apiUrl)
    return this.http.get<any>(this.apiUrl);
  }
}
