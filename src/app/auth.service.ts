import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  getAuthURL() {
    return this.http.get(
      `${environment.BASE_API_URL}/airtable/redirect-testing`
    );
  }

  exchangeCodeForToken(code: string, state: string) {
    // Adjust the URL if your backend runs on a different port or domain
    return this.http.get<any>(
      `${
        environment.BASE_API_URL
      }/airtable/airtable-oauth?code=${encodeURIComponent(
        code
      )}&state=${encodeURIComponent(state)}`
    );
  }

  getAirtableBases() {
    return this.http.get(`${environment.BASE_API_URL}/airtable/bases`);
  }

  getAirtableTables(baseId: string) {
    return this.http.get(
      `${environment.BASE_API_URL}/airtable/tables?baseId=${encodeURIComponent(
        baseId
      )}`
    );
  }

  getAirtableTickets(baseId: string, tableId: string) {
    return this.http.get(
      `${environment.BASE_API_URL}/airtable/tickets?baseId=${baseId}&tableId=${tableId}`
    );
  }

  getRevisionHistory(baseId: string, tableId: string) {
    return this.http.get(
      `${environment.BASE_API_URL}/airtable/revision-history?baseId=${baseId}&tableId=${tableId}`
    );
  }

  syncAll() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('airtable_access_token')}`,
    });
    return this.http.post(
      `${environment.BASE_API_URL}/airtable/syncAll`,
      {},
      { headers }
    );
  }
}
