import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SnippetService {

  private baseUrl = 'http://localhost:3000';

  private options: { headers: HttpHeaders; params: HttpParams } = {
    headers: new HttpHeaders(),
    params: new HttpParams()
  };

  constructor(private http: HttpClient) { }

  setItems(token: any) {
    localStorage.setItem('access_token', token);
    this.options.headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`
    });
  }

  AuthenticateUser(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/authenticate`, data);
  }

  getSnippets(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  addLanguage(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, data, this.options);
  }

  addLanguageSnippet(id: any, snippet: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, snippet, this.options);
  }

  searchSnippets(data: any): Observable<any[]> {
    this.options.params = new HttpParams()
      .set('language', data.language)
      .set('snippets.name', data.snippet);
    return this.http.get<any[]>(`${this.baseUrl}/search`, this.options);
  }

  deleteSnippet(id: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`, this.options);
  }

}
