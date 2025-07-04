import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AgGridAngular } from 'ag-grid-angular';
import {
  ClientSideRowModelModule,
  ColDef,
  GridApi,
  themeMaterial,
  GridReadyEvent,
  colorSchemeDark,
  ModuleRegistry,
  QuickFilterModule,
  PaginationModule,
  ValidationModule,
  CellStyleModule,
  CellSpanModule,
  IRowNode,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
} from 'ag-grid-community';
import { AuthService } from '../../../auth.service';
ModuleRegistry.registerModules([
  CellStyleModule,
  ValidationModule,
  NumberFilterModule,
  DateFilterModule,
  TextFilterModule,
  CellSpanModule,
  QuickFilterModule,
  ClientSideRowModelModule,
  PaginationModule,
]);

@Component({
  selector: 'table-details',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './table-details.component.html',
  styleUrl: './table-details.component.scss',
})
export class TableDetailsComponent implements OnChanges {
  @Input() data: any[] = [];
  private gridApi!: GridApi;
  theme = themeMaterial.withPart(colorSchemeDark);

  columnDefs: ColDef[] = [
    {
      field: 'fields.ProjectID',
      maxWidth: 50,
      headerName: 'ProjectID',
    },
  ];

  defaultColDef: ColDef = {
    flex: 1,
  };
  rowData!: IRowNode[];
  constructor(private http: HttpClient, private service: AuthService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.data && this.data.length > 0) {
      this.rowData = this.data;
      this.columnDefs = this.generateColumnDefs(this.rowData);

      if (this.gridApi) {
        // Update columns
        this.gridApi.setGridOption('columnDefs', this.columnDefs);
        // Update rows
        this.gridApi.setGridOption('rowData', []);
      }
    }
  }

  onFilterTextBoxChanged() {
    this.gridApi.setGridOption(
      'quickFilterText',
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.rowData = this.data;
    console.log(this.rowData);
  }

  generateColumnDefs(data: any[]): ColDef[] {
    if (!data || data.length === 0) return [];

    const include = [
      'ProjectID',
      'TicketID',
      'UserID',
      'ProjectName',
      'FullName',
      'EmailAddress',
      'Title',
      'Role',
      'LastActiveDate',
      'Description',
      'Name',
      'Assignee',
      'Status.name',
      'AuthoredBy',
      'Priority',
      'DueDate',
      'Comments',

      'Budget',
      'Status',
    ];

    // Get only the included keys that exist in the first row
    const keys = include.filter((key) => key in data[0]);

    console.log(keys);
    // Generate column definitions
    return keys.map((key) => ({
      headerName: key,
      field: key,
      valueFormatter: (params) => {
        const value = params.value;
        if (Array.isArray(value))
          return value.length === 0 ? '' : value.join(', ');
        if (typeof value === 'object' && value !== null)
          return JSON.stringify(value);
        return value;
      },
    }));
  }
}
