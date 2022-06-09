import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from "@angular/common/http";
import { DatePipe } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatRadioChange } from '@angular/material/radio';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'environments/environment';
import { Fr001Monitoreo1Model } from './../../../models/fr001Monitoreo1.model';

import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx';

@Component({
  selector: 'fr001Monitoreo1-cmp',
  templateUrl: 'fr001Monitoreo1.component.html',
  styleUrls: ['fr001Monitoreo1.component.css']
})

export class Fr001Monitoreo1 implements OnInit {

  fechaExcel = this.datepipe.transform(new Date(), 'dd-MM-yyyy');

  displayedColumnsRIL1: string[] = ['item', 'location', 'creation_date', 'id_ref', 'seccion', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus'];
  headRIL1 = [['item', 'location', 'creation_date', 'id_ref', 'seccion', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus']]
  headRIL1Excel = [['xxmab_repl_item_loc_fr001, 1.1, 1.2', '', '', '', '', '', '', 'Fecha creación: ' + this.fechaExcel.toString(), ''],
  ['item', 'location', 'creation_date', 'id_ref', 'seccion', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus']]

  @ViewChild('PaginatorRIL1', { static: true }) paginatorRIL1: MatPaginator;
  @ViewChild('SortRIL1', { static: true }) sortRIL1: MatSort
  dataResponseRIL1 = null;
  dataResponseTableRIL1 = null;
  alertSuccessRIL1 = false;
  alertWarningRIL1 = false;
  showComponentsRIL1 = false;
  alertElementsRIL1 = false;
  numElementsRIL1: any;
  showSpinnerRIL1 = false;
  hideButtonMostarRIL1 = true;
  responseRIL1: any;
  reportPdfRIL1 = false;
  reportExcelRIL1 = false;

  displayedColumnsRIL2: string[] = ['item', 'location', 'creation_date', 'id_ref', 'seccion', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus'];
  headRIL2 = [['item', 'location', 'creation_date', 'id_ref', 'seccion', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus']]
  headRIL2Excel = [['xxmab_repl_item_loc_fr001, 1.1, 1.2', '', '', '', '', '', '', 'Fecha creación: ' + this.fechaExcel.toString(), ''],
  ['item', 'location', 'creation_date', 'id_ref', 'seccion', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus']]

  @ViewChild('PaginatorRIL2', { static: true }) paginatorRIL2: MatPaginator;
  @ViewChild('SortRIL2', { static: true }) sortRIL2: MatSort
  dataResponseRIL2 = null;
  dataResponseTableRIL2 = null;
  alertSuccessRIL2 = false;
  alertWarningRIL2 = false;
  showComponentsRIL2 = false;
  alertElementsRIL2 = false;
  numElementsRIL2: any;
  showSpinnerRIL2 = false;
  hideButtonMostarRIL2 = true;
  responseRIL2: any;
  reportPdfRIL2 = false;
  reportExcelRIL2 = false;

  displayedColumnsRIL3: string[] = ['item', 'location', 'creation_date', 'id_ref', 'seccion', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus'];
  headRIL3 = [['item', 'location', 'creation_date', 'id_ref', 'seccion', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus']]
  headRIL3Excel = [['xxmab_repl_item_loc_fr001, 1.1, 1.2', '', '', '', '', '', '', 'Fecha creación: ' + this.fechaExcel.toString(), ''],
  ['item', 'location', 'creation_date', 'id_ref', 'seccion', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus']]

  @ViewChild('PaginatorRIL3', { static: true }) paginatorRIL3: MatPaginator;
  @ViewChild('SortRIL3', { static: true }) sortRIL3: MatSort
  dataResponseRIL3 = null;
  dataResponseTableRIL3 = null;
  alertSuccessRIL3 = false;
  alertWarningRIL3 = false;
  showComponentsRIL3 = false;
  alertElementsRIL3 = false;
  numElementsRIL3: any;
  showSpinnerRIL3 = false;
  hideButtonMostarRIL3 = true;
  responseRIL3: any;
  reportPdfRIL3 = false;
  reportExcelRIL3 = false;

  displayedColumnsRIL4: string[] = ['item', 'location', 'creation_date', 'id_ref', 'seccion', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus'];
  headRIL4 = [['item', 'location', 'creation_date', 'id_ref', 'seccion', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus']]
  headRIL4Excel = [['xxmab_repl_item_loc_fr001, 1.1, 1.2', '', '', '', '', '', '', 'Fecha creación: ' + this.fechaExcel.toString(), ''],
  ['item', 'location', 'creation_date', 'id_ref', 'seccion', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus']]

  @ViewChild('PaginatorRIL4', { static: true }) paginatorRIL4: MatPaginator;
  @ViewChild('SortRIL4', { static: true }) sortRIL4: MatSort
  dataResponseRIL4 = null;
  dataResponseTableRIL4 = null;
  alertSuccessRIL4 = false;
  alertWarningRIL4 = false;
  showComponentsRIL4 = false;
  alertElementsRIL4 = false;
  numElementsRIL4: any;
  showSpinnerRIL4 = false;
  hideButtonMostarRIL4 = true;
  responseRIL4: any;
  reportPdfRIL4 = false;
  reportExcelRIL4 = false;

  displayedColumnsRIL5: string[] = ['item', 'location', 'creation_date', 'id_ref', 'seccion', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus'];
  headRIL5 = [['item', 'location', 'creation_date', 'id_ref', 'seccion', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus']]
  headRIL5Excel = [['xxmab_repl_item_loc_fr001, 1.1, 1.2', '', '', '', '', '', '', 'Fecha creación: ' + this.fechaExcel.toString(), ''],
  ['item', 'location', 'creation_date', 'id_ref', 'seccion', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus']]

  @ViewChild('PaginatorRIL5', { static: true }) paginatorRIL5: MatPaginator;
  @ViewChild('SortRIL5', { static: true }) sortRIL5: MatSort
  dataResponseRIL5 = null;
  dataResponseTableRIL5 = null;
  alertSuccessRIL5 = false;
  alertWarningRIL5 = false;
  showComponentsRIL5 = false;
  alertElementsRIL5 = false;
  numElementsRIL5: any;
  showSpinnerRIL5 = false;
  hideButtonMostarRIL5 = true;
  responseRIL5: any;
  reportPdfRIL5 = false;
  reportExcelRIL5 = false;

  appId: any;
  encrypt: any;

  fecha = false;
  idRef = false;

  estatusA = true;
  estatusC = false;

  fechaInicio: any;
  fechaFin: any;
  idReferencia: any;

  rangoFechas = '';
  idRefObligatorio = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    public datepipe: DatePipe,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.spinner.show();
    this.appId = localStorage.getItem('appId');
    this.encrypt = localStorage.getItem('encrypt');

    this.http.get<any>(environment.urlLogin + 'appId=' + this.appId + '&encrypt=' + this.encrypt + '').subscribe(response => {
      console.log("todo ok")
      this.spinner.hide();
    }, err => {
      console.log("Error: ", err);
      //const dialogRef = this.dialog.open(DialogContentExampleDialog);
      this.spinner.hide();
      this.router.navigate(['/login']);
    });
  }

  buscar() {

    this.dataResponseTableRIL1 = [];
    this.numElementsRIL1 = [];
    this.dataResponseRIL1 = [];
    this.hideButtonMostarRIL1 = true;
    this.showComponentsRIL1 = false;
    this.alertElementsRIL1 = false;
    this.alertSuccessRIL1 = false;
    this.alertWarningRIL1 = false;

    this.dataResponseTableRIL2 = [];
    this.numElementsRIL2 = [];
    this.dataResponseRIL2 = [];
    this.hideButtonMostarRIL2 = true;
    this.showComponentsRIL2 = false;
    this.alertElementsRIL2 = false;
    this.alertSuccessRIL2 = false;
    this.alertWarningRIL2 = false;

    this.dataResponseTableRIL3 = [];
    this.numElementsRIL3 = [];
    this.dataResponseRIL3 = [];
    this.hideButtonMostarRIL3 = true;
    this.showComponentsRIL3 = false;
    this.alertElementsRIL3 = false;
    this.alertSuccessRIL3 = false;
    this.alertWarningRIL3 = false;

    this.dataResponseTableRIL4 = [];
    this.numElementsRIL4 = [];
    this.dataResponseRIL4 = [];
    this.hideButtonMostarRIL4 = true;
    this.showComponentsRIL4 = false;
    this.alertElementsRIL4 = false;
    this.alertSuccessRIL4 = false;
    this.alertWarningRIL4 = false;

    this.dataResponseTableRIL5 = [];
    this.numElementsRIL5 = [];
    this.dataResponseRIL5 = [];
    this.hideButtonMostarRIL5 = true;
    this.showComponentsRIL5 = false;
    this.alertElementsRIL5 = false;
    this.alertSuccessRIL5 = false;
    this.alertWarningRIL5 = false;

    let fInicio = this.datepipe.transform(this.fechaInicio, 'yyyy-MM-dd');
    let fFinal = this.datepipe.transform(this.fechaFin, 'yyyy-MM-dd');

    let fechaValI = new Date(this.fechaInicio)
    let fechaValF = new Date(this.fechaFin)

    let milisegDias = 24 * 60 * 60 * 1000;

    let milisegTanscurridos = Math.abs(fechaValI.getTime() - fechaValF.getTime());

    let diasTranscurridos = Math.round(milisegTanscurridos / milisegDias);

    console.log("fInicio: ", fInicio);
    console.log("fFinal: ", fFinal);
    console.log("this.idReferencia: ", this.idReferencia);
    console.log("estatusA: ", this.estatusA);
    console.log("estatusC: ", this.estatusC);

    var estatusBusuqeda = 'A';

    if (this.estatusA == true && this.estatusC == false) {
      estatusBusuqeda = 'A';
    } else if (this.estatusA == false && this.estatusC == true) {
      estatusBusuqeda = 'C';
    }


    if (diasTranscurridos > 30) {
      this.rangoFechas = "* El rango de fechas debe ser de 30 dias"
    }
    else if (fInicio == null || fFinal == null) {
      this.rangoFechas = "* El campo fecha de inicio y fecha final es obligatorio"
    }
    else {

      this.rangoFechas = ""
      this.idRefObligatorio = '';

      //tabla 1

      var urlRIL1 = '';

      if (this.idReferencia != undefined) {
        urlRIL1 = environment.urlServices + 'fr001/xxmab_repl_item_loc_1/?fechaInicio=' + fInicio + '&fechaFin=' + fFinal + '&idRef=' + this.idReferencia + '&estatusReg=' + estatusBusuqeda;
      } else {
        urlRIL1 = environment.urlServices + 'fr001/xxmab_repl_item_loc_1/?fechaInicio=' + fInicio + '&fechaFin=' + fFinal + '&idRef=' + '&estatusReg=' + estatusBusuqeda;;
      }

      this.showSpinnerRIL1 = true;

      this.http.get<any>(urlRIL1).subscribe(response => {
        console.log(response);
        if (response['count'] > 0) {
          this.responseRIL1 = response;
          this.dataResponseTableRIL1 = response['items'];
          this.numElementsRIL1 = response['count'];
          this.alertElementsRIL1 = true;
        } else {
          this.alertSuccessRIL1 = true;
        }
        this.showSpinnerRIL1 = false;
      }, err => {
        this.alertWarningRIL1 = true;
        this.showSpinnerRIL1 = false;
      });

      //tabla 2

      var urlRIL2 = '';

      if (this.idReferencia != undefined) {
        urlRIL2 = environment.urlServices + 'fr001/xxmab_repl_item_loc_2/?fechaInicio=' + fInicio + '&fechaFin=' + fFinal + '&idRef=' + this.idReferencia + '&estatusReg=' + estatusBusuqeda;
      } else {
        urlRIL2 = environment.urlServices + 'fr001/xxmab_repl_item_loc_2/?fechaInicio=' + fInicio + '&fechaFin=' + fFinal + '&idRef=' + '&estatusReg=' + estatusBusuqeda;
      }

      this.showSpinnerRIL2 = true;

      this.http.get<any>(urlRIL2).subscribe(response => {
        console.log(response);
        if (response['count'] > 0) {
          this.responseRIL2 = response;
          this.dataResponseTableRIL2 = response['items'];
          this.numElementsRIL2 = response['count'];
          this.alertElementsRIL2 = true;
        } else {
          this.alertSuccessRIL2 = true;
        }
        this.showSpinnerRIL2 = false;
      }, err => {
        this.alertWarningRIL2 = true;
        this.showSpinnerRIL2 = false;
      });

      //tabla 3

      var urlRIL3 = '';

      if (this.idReferencia != undefined) {
        urlRIL3 = environment.urlServices + 'fr001/xxmab_repl_item_loc_3/?fechaInicio=' + fInicio + '&fechaFin=' + fFinal + '&idRef=' + this.idReferencia + '&estatusReg=' + estatusBusuqeda;
      } else {
        urlRIL3 = environment.urlServices + 'fr001/xxmab_repl_item_loc_3/?fechaInicio=' + fInicio + '&fechaFin=' + fFinal + '&idRef=' + '&estatusReg=' + estatusBusuqeda;
      }

      this.showSpinnerRIL3 = true;

      this.http.get<any>(urlRIL3).subscribe(response => {
        console.log(response);
        if (response['count'] > 0) {
          this.responseRIL3 = response;
          this.dataResponseTableRIL3 = response['items'];
          this.numElementsRIL3 = response['count'];
          this.alertElementsRIL3 = true;
        } else {
          this.alertSuccessRIL3 = true;
        }
        this.showSpinnerRIL3 = false;
      }, err => {
        this.alertWarningRIL3 = true;
        this.showSpinnerRIL3 = false;
      });

      //tabla 4

      var urlRIL4 = '';

      if (this.idReferencia != undefined) {
        urlRIL4 = environment.urlServices + 'fr001/xxmab_repl_item_loc_4/?fechaInicio=' + fInicio + '&fechaFin=' + fFinal + '&idRef=' + this.idReferencia + '&estatusReg=' + estatusBusuqeda;
      } else {
        urlRIL4 = environment.urlServices + 'fr001/xxmab_repl_item_loc_4/?fechaInicio=' + fInicio + '&fechaFin=' + fFinal + '&idRef=' + '&estatusReg=' + estatusBusuqeda;
      }

      this.showSpinnerRIL4 = true;

      this.http.get<any>(urlRIL4).subscribe(response => {
        console.log(response);
        if (response['count'] > 0) {
          this.responseRIL4 = response;
          this.dataResponseTableRIL4 = response['items'];
          this.numElementsRIL4 = response['count'];
          this.alertElementsRIL4 = true;
        } else {
          this.alertSuccessRIL4 = true;
        }
        this.showSpinnerRIL4 = false;
      }, err => {
        this.alertWarningRIL4 = true;
        this.showSpinnerRIL4 = false;
      });

      //tabla 5

      var urlRIL5 = '';

      if (this.idReferencia != undefined) {
        urlRIL5 = environment.urlServices + 'fr001/xxmab_repl_item_loc_5/?fechaInicio=' + fInicio + '&fechaFin=' + fFinal + '&idRef=' + this.idReferencia + '&estatusReg=' + estatusBusuqeda;
      } else {
        urlRIL5 = environment.urlServices + 'fr001/xxmab_repl_item_loc_5/?fechaInicio=' + fInicio + '&fechaFin=' + fFinal + '&idRef=' + '&estatusReg=' + estatusBusuqeda;
      }

      this.showSpinnerRIL5 = true;

      this.http.get<any>(urlRIL5).subscribe(response => {
        console.log(response);
        if (response['count'] > 0) {
          this.responseRIL5 = response;
          this.dataResponseTableRIL5 = response['items'];
          this.numElementsRIL5 = response['count'];
          this.alertElementsRIL5 = true;
        } else {
          this.alertSuccessRIL5 = true;
        }
        this.showSpinnerRIL5 = false;
      }, err => {
        this.alertWarningRIL5 = true;
        this.showSpinnerRIL5 = false;
      });
    }

  }

  showTableRIL1() {
    this.dataResponseRIL1 = new MatTableDataSource<Fr001Monitoreo1Model>(this.responseRIL1['items'])
    this.dataResponseRIL1.paginator = this.paginatorRIL1;
    this.dataResponseRIL1.sort = this.sortRIL1;
    this.showComponentsRIL1 = true;
    this.hideButtonMostarRIL1 = false;
  }

  showTableRIL2() {
    this.dataResponseRIL2 = new MatTableDataSource<Fr001Monitoreo1Model>(this.responseRIL2['items'])
    this.dataResponseRIL2.paginator = this.paginatorRIL2;
    this.dataResponseRIL2.sort = this.sortRIL2;
    this.showComponentsRIL2 = true;
    this.hideButtonMostarRIL2 = false;
  }

  showTableRIL3() {
    this.dataResponseRIL3 = new MatTableDataSource<Fr001Monitoreo1Model>(this.responseRIL3['items'])
    this.dataResponseRIL3.paginator = this.paginatorRIL3;
    this.dataResponseRIL3.sort = this.sortRIL3;
    this.showComponentsRIL3 = true;
    this.hideButtonMostarRIL3 = false;
  }

  showTableRIL4() {
    this.dataResponseRIL4 = new MatTableDataSource<Fr001Monitoreo1Model>(this.responseRIL4['items'])
    this.dataResponseRIL4.paginator = this.paginatorRIL4;
    this.dataResponseRIL4.sort = this.sortRIL4;
    this.showComponentsRIL4 = true;
    this.hideButtonMostarRIL4 = false;
  }

  showTableRIL5() {
    this.dataResponseRIL5 = new MatTableDataSource<Fr001Monitoreo1Model>(this.responseRIL5['items'])
    this.dataResponseRIL5.paginator = this.paginatorRIL5;
    this.dataResponseRIL5.sort = this.sortRIL5;
    this.showComponentsRIL5 = true;
    this.hideButtonMostarRIL5 = false;
  }

  applyFilterRIL1(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataResponseRIL1.filter = filterValue.trim().toLowerCase();
    console.log(this.dataResponseRIL1)
  }

  applyFilterRIL2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataResponseRIL2.filter = filterValue.trim().toLowerCase();
    console.log(this.dataResponseRIL2)
  }

  applyFilterRIL3(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataResponseRIL3.filter = filterValue.trim().toLowerCase();
    console.log(this.dataResponseRIL3)
  }

  applyFilterRIL4(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataResponseRIL4.filter = filterValue.trim().toLowerCase();
    console.log(this.dataResponseRIL4)
  }

  applyFilterRIL5(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataResponseRIL5.filter = filterValue.trim().toLowerCase();
    console.log(this.dataResponseRIL5)
  }

  createPdfRIL1() {

    var rows = [];

    this.dataResponseTableRIL1.forEach(element => {
      var temp = [element.item, element.location, element.creation_date?.substr(0, 10), element.id_ref, element.seccion, element.last_update_date, element.last_updated_by, element.comentarios, element.estatus];
      rows.push(temp);
    })

    var doc1 = new jsPDF({ orientation: "landscape" });

    doc1.setFontSize(18);
    doc1.text('xxmab_repl_item_loc_fr001, 1.1, 1.2', 11, 8);
    doc1.setFontSize(11);
    doc1.setTextColor(100);

    let fecha = this.datepipe.transform(new Date(), 'dd-MM-yyyy');

    doc1.text('Fecha creación: ' + fecha.toString(), 240, 8);

    (doc1 as any).autoTable({
      head: this.headRIL1,
      body: rows,
      theme: 'striped',
      didDrawCell: data => {
        console.log(data.column.index)
        console.log(data.column)
        console.log(data)
      }
    })

    // below line for Open PDF document in new tab
    doc1.output('dataurlnewwindow')

    // below line for Download PDF document  
    doc1.save('fr001Modulo1.pdf');
  }

  exportExcelRIL1() {

    var rows = [];

    this.dataResponseTableRIL1.forEach(element => {
      var temp = [element.item, element.location, element.creation_date?.substr(0, 10), element.id_ref, element.seccion, element.last_update_date, element.last_updated_by, element.comentarios, element.estatus];
      rows.push(temp);
    })

    var header = this.headRIL1Excel;

    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.sheet_add_aoa(ws, header);
    XLSX.utils.book_append_sheet(wb, ws, "fr001Modulo1.xlsx");
    XLSX.writeFile(wb, "fr001Modulo1.xlsx");

  }

  //tabla 2

  createPdfRIL2() {

    var rows = [];

    this.dataResponseTableRIL2.forEach(element => {
      var temp = [element.item, element.location, element.creation_date?.substr(0, 10), element.id_ref, element.seccion, element.last_update_date, element.last_updated_by, element.comentarios, element.estatus];
      rows.push(temp);
    })

    var doc1 = new jsPDF({ orientation: "landscape" });

    doc1.setFontSize(18);
    doc1.text('xxmab_repl_item_loc_fr001, 1.3, 1.4', 11, 8);
    doc1.setFontSize(11);
    doc1.setTextColor(100);

    let fecha = this.datepipe.transform(new Date(), 'dd-MM-yyyy');

    doc1.text('Fecha creación: ' + fecha.toString(), 240, 8);

    (doc1 as any).autoTable({
      head: this.headRIL2,
      body: rows,
      theme: 'striped',
      didDrawCell: data => {
        console.log(data.column.index)
        console.log(data.column)
        console.log(data)
      }
    })

    // below line for Open PDF document in new tab
    doc1.output('dataurlnewwindow')

    // below line for Download PDF document  
    doc1.save('fr001Modulo1.pdf');
  }

  exportExcelRIL2() {

    var rows = [];

    this.dataResponseTableRIL2.forEach(element => {
      var temp = [element.item, element.location, element.creation_date?.substr(0, 10), element.id_ref, element.seccion, element.last_update_date, element.last_updated_by, element.comentarios, element.estatus];
      rows.push(temp);
    })

    var header = this.headRIL2Excel;

    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.sheet_add_aoa(ws, header);
    XLSX.utils.book_append_sheet(wb, ws, "fr001Modulo1.xlsx");
    XLSX.writeFile(wb, "fr001Modulo1.xlsx");

  }

  //tabla3

  createPdfRIL3() {

    var rows = [];

    this.dataResponseTableRIL3.forEach(element => {
      var temp = [element.item, element.location, element.creation_date?.substr(0, 10), element.id_ref, element.seccion, element.last_update_date, element.last_updated_by, element.comentarios, element.estatus];
      rows.push(temp);
    })

    var doc1 = new jsPDF({ orientation: "landscape" });

    doc1.setFontSize(18);
    doc1.text('xxmab_repl_item_loc_fr001, 1.7, 1.8', 11, 8);
    doc1.setFontSize(11);
    doc1.setTextColor(100);

    let fecha = this.datepipe.transform(new Date(), 'dd-MM-yyyy');

    doc1.text('Fecha creación: ' + fecha.toString(), 240, 8);

    (doc1 as any).autoTable({
      head: this.headRIL3,
      body: rows,
      theme: 'striped',
      didDrawCell: data => {
        console.log(data.column.index)
        console.log(data.column)
        console.log(data)
      }
    })

    // below line for Open PDF document in new tab
    doc1.output('dataurlnewwindow')

    // below line for Download PDF document  
    doc1.save('fr001Modulo1.pdf');
  }

  exportExcelRIL3() {

    var rows = [];

    this.dataResponseTableRIL3.forEach(element => {
      var temp = [element.item, element.location, element.creation_date?.substr(0, 10), element.id_ref, element.seccion, element.last_update_date, element.last_updated_by, element.comentarios, element.estatus];
      rows.push(temp);
    })

    var header = this.headRIL3Excel;

    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.sheet_add_aoa(ws, header);
    XLSX.utils.book_append_sheet(wb, ws, "fr001Modulo1.xlsx");
    XLSX.writeFile(wb, "fr001Modulo1.xlsx");

  }

  //tabla4

  createPdfRIL4() {

    var rows = [];

    this.dataResponseTableRIL4.forEach(element => {
      var temp = [element.item, element.location, element.creation_date?.substr(0, 10), element.id_ref, element.seccion, element.last_update_date, element.last_updated_by, element.comentarios, element.estatus];
      rows.push(temp);
    })

    var doc1 = new jsPDF({ orientation: "landscape" });

    doc1.setFontSize(18);
    doc1.text('xxmab_repl_item_loc_fr001, 2.1, 2.2', 11, 8);
    doc1.setFontSize(11);
    doc1.setTextColor(100);

    let fecha = this.datepipe.transform(new Date(), 'dd-MM-yyyy');

    doc1.text('Fecha creación: ' + fecha.toString(), 240, 8);

    (doc1 as any).autoTable({
      head: this.headRIL4,
      body: rows,
      theme: 'striped',
      didDrawCell: data => {
        console.log(data.column.index)
        console.log(data.column)
        console.log(data)
      }
    })

    // below line for Open PDF document in new tab
    doc1.output('dataurlnewwindow')

    // below line for Download PDF document  
    doc1.save('fr001Modulo1.pdf');
  }

  exportExcelRIL4() {

    var rows = [];

    this.dataResponseTableRIL4.forEach(element => {
      var temp = [element.item, element.location, element.creation_date?.substr(0, 10), element.id_ref, element.seccion, element.last_update_date, element.last_updated_by, element.comentarios, element.estatus];
      rows.push(temp);
    })

    var header = this.headRIL4Excel;

    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.sheet_add_aoa(ws, header);
    XLSX.utils.book_append_sheet(wb, ws, "fr001Modulo1.xlsx");
    XLSX.writeFile(wb, "fr001Modulo1.xlsx");

  }

  //tabla 5

  createPdfRIL5() {

    var rows = [];

    this.dataResponseTableRIL5.forEach(element => {
      var temp = [element.item, element.location, element.creation_date?.substr(0, 10), element.id_ref, element.seccion, element.last_update_date, element.last_updated_by, element.comentarios, element.estatus];
      rows.push(temp);
    })

    var doc1 = new jsPDF({ orientation: "landscape" });

    doc1.setFontSize(18);
    doc1.text('xxmab_repl_item_loc_fr001, 2.3, 2.4', 11, 8);
    doc1.setFontSize(11);
    doc1.setTextColor(100);

    let fecha = this.datepipe.transform(new Date(), 'dd-MM-yyyy');

    doc1.text('Fecha creación: ' + fecha.toString(), 240, 8);

    (doc1 as any).autoTable({
      head: this.headRIL5,
      body: rows,
      theme: 'striped',
      didDrawCell: data => {
        console.log(data.column.index)
        console.log(data.column)
        console.log(data)
      }
    })

    // below line for Open PDF document in new tab
    doc1.output('dataurlnewwindow')

    // below line for Download PDF document  
    doc1.save('fr001Modulo1.pdf');
  }

  exportExcelRIL5() {

    var rows = [];

    this.dataResponseTableRIL5.forEach(element => {
      var temp = [element.item, element.location, element.creation_date?.substr(0, 10), element.id_ref, element.seccion, element.last_update_date, element.last_updated_by, element.comentarios, element.estatus];
      rows.push(temp);
    })

    var header = this.headRIL5Excel;

    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.sheet_add_aoa(ws, header);
    XLSX.utils.book_append_sheet(wb, ws, "fr001Modulo1.xlsx");
    XLSX.writeFile(wb, "fr001Modulo1.xlsx");

  }

  radioChange(event: MatRadioChange) {
    if (event.value == 'fecha') {
      this.idRef = false
      this.fecha = true
    } else if (event.value == 'idRef') {
      this.fecha = false
      this.idRef = true
    }
  }


  radioChangeEstatus(event: MatRadioChange) {
    if (event.value == 'estatusA') {
      this.estatusA = true
      this.estatusC = false
    } else if (event.value == 'estatusC') {
      this.estatusA = false
      this.estatusC = true
    }
  }

  radioChangeReportRIL1(event: MatRadioChange) {
    if (event.value == 'pdf') {
      this.reportExcelRIL1 = false
      this.reportPdfRIL1 = true
    } else if (event.value == 'excel') {
      this.reportPdfRIL1 = false
      this.reportExcelRIL1 = true
    }
  }

  radioChangeReportRIL2(event: MatRadioChange) {
    if (event.value == 'pdf') {
      this.reportExcelRIL2 = false
      this.reportPdfRIL2 = true
    } else if (event.value == 'excel') {
      this.reportPdfRIL2 = false
      this.reportExcelRIL2 = true
    }
  }

  radioChangeReportRIL3(event: MatRadioChange) {
    if (event.value == 'pdf') {
      this.reportExcelRIL3 = false
      this.reportPdfRIL3 = true
    } else if (event.value == 'excel') {
      this.reportPdfRIL3 = false
      this.reportExcelRIL3 = true
    }
  }

  radioChangeReportRIL4(event: MatRadioChange) {
    if (event.value == 'pdf') {
      this.reportExcelRIL4 = false
      this.reportPdfRIL4 = true
    } else if (event.value == 'excel') {
      this.reportPdfRIL4 = false
      this.reportExcelRIL4 = true
    }
  }

  radioChangeReportRIL5(event: MatRadioChange) {
    if (event.value == 'pdf') {
      this.reportExcelRIL5 = false
      this.reportPdfRIL5 = true
    } else if (event.value == 'excel') {
      this.reportPdfRIL5 = false
      this.reportExcelRIL5 = true
    }
  }

  updateEstatusRIL1() {
    let fInicio = this.datepipe.transform(this.fechaInicio, 'yyyy-MM-dd');
    let fFinal = this.datepipe.transform(this.fechaFin, 'yyyy-MM-dd');
    this.dialog.open(DialogConfirmRIL1, {
      data: { fechaInicial: fInicio, fechaFinal: fFinal }
    });
  }

  updateEstatusRIL2() {
    let fInicio = this.datepipe.transform(this.fechaInicio, 'yyyy-MM-dd');
    let fFinal = this.datepipe.transform(this.fechaFin, 'yyyy-MM-dd');
    this.dialog.open(DialogConfirmRIL2, {
      data: { fechaInicial: fInicio, fechaFinal: fFinal }
    });
  }

  updateEstatusRIL3() {
    let fInicio = this.datepipe.transform(this.fechaInicio, 'yyyy-MM-dd');
    let fFinal = this.datepipe.transform(this.fechaFin, 'yyyy-MM-dd');
    this.dialog.open(DialogConfirmRIL3, {
      data: { fechaInicial: fInicio, fechaFinal: fFinal }
    });
  }

  updateEstatusRIL4() {
    let fInicio = this.datepipe.transform(this.fechaInicio, 'yyyy-MM-dd');
    let fFinal = this.datepipe.transform(this.fechaFin, 'yyyy-MM-dd');
    this.dialog.open(DialogConfirmRIL4, {
      data: { fechaInicial: fInicio, fechaFinal: fFinal }
    });
  }

  updateEstatusRIL5() {
    let fInicio = this.datepipe.transform(this.fechaInicio, 'yyyy-MM-dd');
    let fFinal = this.datepipe.transform(this.fechaFin, 'yyyy-MM-dd');
    this.dialog.open(DialogConfirmRIL5, {
      data: { fechaInicial: fInicio, fechaFinal: fFinal }
    });
  }


}

@Component({
  selector: 'dialog-confirmRIL1',
  templateUrl: 'dialog-confirmRIL1.html',
  styleUrls: ['fr001Monitoreo1.component.css']
})
export class DialogConfirmRIL1 {
  constructor(
    public dialogRef: MatDialogRef<DialogConfirmRIL1>,
    @Inject(MAT_DIALOG_DATA) public dataFechas: any,
    private http: HttpClient,
  ) { }

  respuestaSave: any;
  showSpinnerSave = false;
  actualizarButtom = true;

  onNoClick(): void {
    this.dialogRef.close();
  }

  updateEstatusRIL1(idRef, comentario) {
    console.log(idRef)
    console.log(comentario)
    console.log(this.dataFechas.fechaInicial)
    console.log(this.dataFechas.fechaFinal)
    this.showSpinnerSave = true;
    const headers = {
      'estatus': 'C',
      'idRef': idRef,
      'userUpdate': 'yo',
      'comentarios': comentario,
      'fechaInicial': this.dataFechas.fechaInicial,
      'fechaFinal': this.dataFechas.fechaFinal
    };
    const body = {
      'estatus': 'C',
      'idRef': idRef,
      'userUpdate': 'yo',
      'comentarios': comentario,
      'fechaInicial': this.dataFechas.fechaInicial,
      'fechaFinal': this.dataFechas.fechaFinal
    };
    this.http.put<any>(environment.urlServices + 'fr001/xxmab_repl_item_loc_1/', body, { headers })
      .subscribe(data => {
        this.respuestaSave = data.response
        this.showSpinnerSave = false;
        this.actualizarButtom = false;
      });
  }
}

@Component({
  selector: 'dialog-confirmRIL2',
  templateUrl: 'dialog-confirmRIL2.html',
  styleUrls: ['fr001Monitoreo1.component.css']
})
export class DialogConfirmRIL2 {
  constructor(
    public dialogRef: MatDialogRef<DialogConfirmRIL2>,
    @Inject(MAT_DIALOG_DATA) public dataFechas: any,
    private http: HttpClient,
  ) { }

  respuestaSave: any;
  showSpinnerSave = false;
  actualizarButtom = true;

  onNoClick(): void {
    this.dialogRef.close();
  }

  updateEstatusRIL2(idRef, comentario) {
    console.log(idRef)
    console.log(comentario)
    this.showSpinnerSave = true;
    const headers = {
      'estatus': 'C',
      'idRef': idRef,
      'userUpdate': 'yo',
      'comentarios': comentario,
      'fechaInicial': this.dataFechas.fechaInicial,
      'fechaFinal': this.dataFechas.fechaFinal
    };
    const body = {
      'estatus': 'C',
      'idRef': idRef,
      'userUpdate': 'yo',
      'comentarios': comentario,
      'fechaInicial': this.dataFechas.fechaInicial,
      'fechaFinal': this.dataFechas.fechaFinal
    };
    this.http.put<any>(environment.urlServices + 'fr001/xxmab_repl_item_loc_2/', body, { headers })
      .subscribe(data => {
        this.respuestaSave = data.response
        this.showSpinnerSave = false;
        this.actualizarButtom = false;
      });
  }
}

@Component({
  selector: 'dialog-confirmRIL3',
  templateUrl: 'dialog-confirmRIL3.html',
  styleUrls: ['fr001Monitoreo1.component.css']
})
export class DialogConfirmRIL3 {
  constructor(
    public dialogRef: MatDialogRef<DialogConfirmRIL3>,
    @Inject(MAT_DIALOG_DATA) public dataFechas: any,
    private http: HttpClient,
  ) { }

  respuestaSave: any;
  showSpinnerSave = false;
  actualizarButtom = true;

  onNoClick(): void {
    this.dialogRef.close();
  }

  updateEstatusRIL3(idRef, comentario) {
    console.log(idRef)
    console.log(comentario)
    this.showSpinnerSave = true;
    const headers = {
      'estatus': 'C',
      'idRef': idRef,
      'userUpdate': 'yo',
      'comentarios': comentario,
      'fechaInicial': this.dataFechas.fechaInicial,
      'fechaFinal': this.dataFechas.fechaFinal
    };
    const body = {
      'estatus': 'C',
      'idRef': idRef,
      'userUpdate': 'yo',
      'comentarios': comentario,
      'fechaInicial': this.dataFechas.fechaInicial,
      'fechaFinal': this.dataFechas.fechaFinal
    };
    this.http.put<any>(environment.urlServices + 'fr001/xxmab_repl_item_loc_3/', body, { headers })
      .subscribe(data => {
        this.respuestaSave = data.response
        this.showSpinnerSave = false;
        this.actualizarButtom = false;
      });
  }
}

@Component({
  selector: 'dialog-confirmRIL4',
  templateUrl: 'dialog-confirmRIL4.html',
  styleUrls: ['fr001Monitoreo1.component.css']
})
export class DialogConfirmRIL4 {
  constructor(
    public dialogRef: MatDialogRef<DialogConfirmRIL4>,
    @Inject(MAT_DIALOG_DATA) public dataFechas: any,
    private http: HttpClient,
  ) { }

  respuestaSave: any;
  showSpinnerSave = false;
  actualizarButtom = true;

  onNoClick(): void {
    this.dialogRef.close();
  }

  updateEstatusRIL4(idRef, comentario) {
    console.log(idRef)
    console.log(comentario)
    this.showSpinnerSave = true;
    const headers = {
      'estatus': 'C',
      'idRef': idRef,
      'userUpdate': 'yo',
      'comentarios': comentario,
      'fechaInicial': this.dataFechas.fechaInicial,
      'fechaFinal': this.dataFechas.fechaFinal
    };
    const body = {
      'estatus': 'C',
      'idRef': idRef,
      'userUpdate': 'yo',
      'comentarios': comentario,
      'fechaInicial': this.dataFechas.fechaInicial,
      'fechaFinal': this.dataFechas.fechaFinal
    };
    this.http.put<any>(environment.urlServices + 'fr001/xxmab_repl_item_loc_4/', body, { headers })
      .subscribe(data => {
        this.respuestaSave = data.response
        this.showSpinnerSave = false;
        this.actualizarButtom = false;
      });
  }
}

@Component({
  selector: 'dialog-confirmRIL5',
  templateUrl: 'dialog-confirmRIL5.html',
  styleUrls: ['fr001Monitoreo1.component.css']
})
export class DialogConfirmRIL5 {
  constructor(
    public dialogRef: MatDialogRef<DialogConfirmRIL5>,
    @Inject(MAT_DIALOG_DATA) public dataFechas: any,
    private http: HttpClient,
  ) { }

  respuestaSave: any;
  showSpinnerSave = false;
  actualizarButtom = true;

  onNoClick(): void {
    this.dialogRef.close();
  }

  updateEstatusRIL5(idRef, comentario) {
    console.log(idRef)
    console.log(comentario)
    this.showSpinnerSave = true;
    const headers = {
      'estatus': 'C',
      'idRef': idRef,
      'userUpdate': 'yo',
      'comentarios': comentario,
      'fechaInicial': this.dataFechas.fechaInicial,
      'fechaFinal': this.dataFechas.fechaFinal
    };
    const body = {
      'estatus': 'C',
      'idRef': idRef,
      'userUpdate': 'yo',
      'comentarios': comentario,
      'fechaInicial': this.dataFechas.fechaInicial,
      'fechaFinal': this.dataFechas.fechaFinal
    };
    this.http.put<any>(environment.urlServices + 'fr001/xxmab_repl_item_loc_5/', body, { headers })
      .subscribe(data => {
        this.respuestaSave = data.response
        this.showSpinnerSave = false;
        this.actualizarButtom = false;
      });
  }
}