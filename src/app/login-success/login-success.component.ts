import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TableDetailsComponent } from '../components/ag-grid/table-details/table-details.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'login-success',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatSnackBarModule,
    CommonModule,
    TableDetailsComponent,
    MatExpansionModule,
    FormsModule,
  ],
  templateUrl: './login-success.component.html',
  styleUrl: './login-success.component.scss',
  providers: [DatePipe],
})
export class LoginSuccessComponent implements OnInit {
  currentDate: string | null;
  private _snackBar = inject(MatSnackBar);
  bases = signal<{ id: number; name: string }[]>([]);
  selectedBase = signal<string | null>('');
  tables = signal<{ id: number; name: string }[]>([]);
  selectedTable = signal<string | null>('');
  tickets: any[] = [];
  selectedView: number | undefined;

  isTableChanged = signal<boolean>(false);
  isReviewFetched = signal<boolean>(false);

  isSyncing: boolean = false;

  revisionHistory: any = {};
  constructor(
    private route: ActivatedRoute,
    private service: AuthService,
    private router: Router,
    private datePipe: DatePipe
  ) {
    this.currentDate = this.datePipe.transform(new Date(), 'fullDate');
  }
  ngOnInit(): void {
    this.service.getAirtableBases().subscribe((response: any) => {
      if (response.success) {
        this.bases.set(response.data);
      }
      console.log(this.bases);
    });
  }
  onSubmit() {
    console.log('Login successful'); // Placeholder for actual logic
  }

  signOut() {
    //this.authService.logout();
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  onBaseChange(value: any) {
    console.log(value);
    localStorage.setItem('selectedBase', value);
    if (value) {
      this.selectedBase.set(value);
      this.service.getAirtableTables(value).subscribe((response: any) => {
        console.log('tables fetched successfully. ', response);
        if (response.success) {
          this.tables.set(response.data);
        }
      });
    }
  }

  onTableChange(value: string) {
    this.isTableChanged.set(true);
    localStorage.setItem('selectedTable', value);
    if (value) {
      console.log(value);
      this.selectedTable.set(value);

      this.service
        .getAirtableTickets(this.selectedBase()!, this.selectedTable()!)
        .subscribe((response: any) => {
          console.log(response);
          if (response.success) {
            this.tickets = response.data;
          }
        });
    }
  }

  fetchRevisionHistory() {
    this.isTableChanged.set(false);
    this.isReviewFetched.set(true);
    const selectedBase = localStorage.getItem('selectedBase');
    const selectedTable = localStorage.getItem('selectedTable');

    if (selectedBase && selectedTable) {
      this.service
        .getRevisionHistory(selectedBase, selectedTable)
        .subscribe((response: any) => {
          this.revisionHistory = response.data;
          console.log('Revision History fetched ', response.data);
        });
    }
  }

  get revisionHistoryArray(): { ticket: string; revisions: any[] }[] {
    return Object.entries(this.revisionHistory || {}).map(
      ([ticket, revisions]) => ({
        ticket,
        revisions: Array.isArray(revisions) ? revisions : [],
      })
    );
  }

  syncAll() {
    this.isSyncing = true;

    this.service.syncAll().subscribe((response: any) => {
      if (response.success) {
        this._snackBar.open(response.message, 'Close', {
          duration: 3000,
        });
      } else
        this._snackBar.open(
          'Failed to sync. Please try againn later.',
          'Close',
          {
            duration: 3000,
          }
        );
      this.isSyncing = false;
    });
  }
}
