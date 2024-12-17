import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  apiUrl = 'assets/suppliers.json';
  productsUrl = 'assets/products.json'; // Path for products data

  constructor(private http: HttpClient) {}

  // Fetch suppliers
  getSuppliers(): Observable<any> {
    console.log('Fetching suppliers from', this.apiUrl);
    return this.http.get<any>(this.apiUrl);
  }

  // Fetch products by supplier ID
  getProductsBySupplierId(supplierId: string): Observable<any> {
    return this.http.get<any>(this.productsUrl).pipe(
      map((response) => {
        // Filter the products based on the supplierId
        return {
          ...response,
          data: response.data.filter((product: any) => product.supplierId === supplierId)
        };
      })
    );
  }
}
