import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Cidade } from '../../interfaces/brasilapi-cidade';
import { Estado } from '../../interfaces/brasilapi-estado';

@Injectable({
  providedIn: 'root',
})
export class BrasilApiService {
  private http = inject(HttpClient);
  private baseUrl: string = 'https://brasilapi.com.br/api';

  listarUfs(): Observable<Estado[]> {
    return this.http.get<Estado[]>(`${this.baseUrl}/ibge/uf/v1`).pipe(
      catchError((err) => {
        console.log(err);
        return of([]);
      }),
    );
  }

  listarCidades(uf: string): Observable<Cidade[]> {
    return this.http.get<Cidade[]>(`${this.baseUrl}/ibge/municipios/v1/${uf}`).pipe(
      catchError((err) => {
        console.log(err);
        return of([]);
      }),
    );
  }
}
