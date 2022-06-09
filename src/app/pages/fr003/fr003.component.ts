import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from "@angular/common/http";
import { DatePipe } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'environments/environment';
import { Fr003Model } from './../../models/fr003.model';
import { MatRadioChange } from '@angular/material/radio';


import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx';

@Component({
    selector: 'fr003-cmp',
    templateUrl: 'fr003.component.html',
    styleUrls: ['fr003.component.css']
})

export class Fr003 implements OnInit {

    fechaExcel = this.datepipe.transform(new Date(), 'dd-MM-yyyy');

    displayedColumnsFRLS: string[] = ['supplier', 'store', 'supp_lead_time', 'creation_date', 'id_ref', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus'];
    headFRLS = [['supplier', 'store', 'supp_lead_time', 'creation_date', 'id_ref', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus']]

    headFRLSExcel = [['xxmab_repl_item_loc_fr001, 1.1, 1.2', '', '', '', '', '', '', 'Fecha creación: ' + this.fechaExcel.toString(), ''],
    ['supplier', 'store', 'supp_lead_time', 'creation_date', 'id_ref', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus']]

    @ViewChild('PaginatorFRLS', { static: true }) paginatorFRLS: MatPaginator;
    @ViewChild('SortFRLS', { static: true }) sortFRLS: MatSort
    dataResponseFRLS = null;
    dataResponseTableFRLS = null;
    alertSuccessFRLS = false;
    alertWarningFRLS = false;
    showComponentsFRLS = false;
    alertElementsFRLS = false;
    numElementsFRLS: any;
    showSpinnerFRLS = false;
    hideButtonMostarFRLS = true;
    responseFRLS: any;
    reportPdfFRLS = false;
    reportExcelFRLS = false;

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

        this.dataResponseTableFRLS = [];
        this.numElementsFRLS = [];
        this.dataResponseFRLS = [];
        this.hideButtonMostarFRLS = true;
        this.showComponentsFRLS = false;
        this.alertElementsFRLS = false;
        this.alertSuccessFRLS = false;
        this.alertWarningFRLS = false;

        let fInicio = this.datepipe.transform(this.fechaInicio, 'yyyy-MM-dd');
        let fFinal = this.datepipe.transform(this.fechaFin, 'yyyy-MM-dd');

        let fechaValI = new Date(this.fechaInicio)
        let fechaValF = new Date(this.fechaFin)

        let milisegDias = 24 * 60 * 60 * 1000;

        let milisegTanscurridos = Math.abs(fechaValI.getTime() - fechaValF.getTime());

        let diasTranscurridos = Math.round(milisegTanscurridos / milisegDias);

        console.log("diasTranscurridos: ", diasTranscurridos);
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

            var url = '';

            if (this.idReferencia != undefined) {
                url = environment.urlServices + 'fr003/xxmab_femsa_repl_leadtime_sups/?fechaInicio=' + fInicio + '&fechaFin=' + fFinal + '&idRef=' + this.idReferencia + '&estatusReg=' + estatusBusuqeda;
            } else {
                url = environment.urlServices + 'fr003/xxmab_femsa_repl_leadtime_sups/?fechaInicio=' + fInicio + '&fechaFin=' + fFinal + '&idRef=' + '&estatusReg=' + estatusBusuqeda;
            }

            console.log("url: ", url)

            this.showSpinnerFRLS = true;

            this.http.get<any>(url).subscribe(response => {
                console.log(response);
                if (response['count'] > 0) {
                    this.responseFRLS = response;
                    this.dataResponseTableFRLS = response['items'];
                    this.numElementsFRLS = response['count'];
                    this.alertElementsFRLS = true;
                } else {
                    this.alertSuccessFRLS = true;
                }
                this.showSpinnerFRLS = false;
            }, err => {
                this.alertWarningFRLS = true;
                this.showSpinnerFRLS = false;
            });
        }

    }

    showTableFRLS() {
        this.dataResponseFRLS = new MatTableDataSource<Fr003Model>(this.responseFRLS['items'])
        this.dataResponseFRLS.paginator = this.paginatorFRLS;
        this.dataResponseFRLS.sort = this.sortFRLS;
        this.showComponentsFRLS = true;
        this.hideButtonMostarFRLS = false;
    }

    applyFfrlser(event: Event) {
        const ffrlserValue = (event.target as HTMLInputElement).value;
        this.dataResponseFRLS.ffrlser = ffrlserValue.trim().toLowerCase();
        console.log(this.dataResponseFRLS)
    }

    createPdfFRLS() {

        var rows = [];

        this.dataResponseTableFRLS.forEach(element => {
            var temp = [element.supplier, element.store, element.supp_lead_time, element.id_ref, element.creation_date?.substr(0, 10), element.last_update_date, element.last_updated_by, element.comentarios, element.estatus];
            rows.push(temp);
        })

        var doc1 = new jsPDF({ orientation: "landscape" });

        doc1.setFontSize(18);
        doc1.text('Monitorear flujo de información del tiempo entrega de proveedor', 11, 8);
        doc1.setFontSize(11);
        doc1.setTextColor(100);

        let fecha = this.datepipe.transform(new Date(), 'dd-MM-yyyy');

        doc1.text('Fecha creación: ' + fecha.toString(), 240, 8);

        (doc1 as any).autoTable({
            head: this.headFRLS,
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
        doc1.save('fr003.pdf');
    }

    exportExcelFRLS() {

        var rows = [];

        this.dataResponseTableFRLS.forEach(element => {
            var temp = [element.supplier, element.store, element.supp_lead_time, element.id_ref, element.creation_date?.substr(0, 10), element.last_update_date, element.last_updated_by, element.comentarios, element.estatus];
            rows.push(temp);
        })

        var header = this.headFRLSExcel;

        var wb = XLSX.utils.book_new();
        var ws = XLSX.utils.json_to_sheet(rows);
        XLSX.utils.sheet_add_aoa(ws, header);
        XLSX.utils.book_append_sheet(wb, ws, "fr003.xlsx");
        XLSX.writeFile(wb, "fr003.xlsx");

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

    radioChangeReportFRLS(event: MatRadioChange) {
        if (event.value == 'pdf') {
            this.reportExcelFRLS = false
            this.reportPdfFRLS = true
        } else if (event.value == 'excel') {
            this.reportPdfFRLS = false
            this.reportExcelFRLS = true
        }
    }


    updateEstatusFRLS() {
        let fInicio = this.datepipe.transform(this.fechaInicio, 'yyyy-MM-dd');
        let fFinal = this.datepipe.transform(this.fechaFin, 'yyyy-MM-dd');
        this.dialog.open(DialogConfirmFRLS, {
            data: { fechaInicial: fInicio, fechaFinal: fFinal }
        });
    }
}

@Component({
    selector: 'dialog-confirmFRLS',
    templateUrl: 'dialog-confirmFRLS.html',
    styleUrls: ['fr003.component.css']
})
export class DialogConfirmFRLS {
    constructor(
        public dialogRef: MatDialogRef<DialogConfirmFRLS>,
        @Inject(MAT_DIALOG_DATA) public dataFechas: any,
        private http: HttpClient,
    ) { }

    respuestaSave: any;
    showSpinnerSave = false;
    actualizarButtom = true;

    onNoClick(): void {
        this.dialogRef.close();
    }

    updateEstatusFRLS(idRef, comentario) {
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
        this.http.put<any>(environment.urlServices + 'fr003/xxmab_femsa_repl_leadtime_sups/', body, { headers })
            .subscribe(data => {
                this.respuestaSave = data.response
                this.showSpinnerSave = false;
                this.actualizarButtom = false;
            });
    }
}