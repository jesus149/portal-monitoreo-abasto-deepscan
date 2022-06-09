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
import { Fr004Model } from './../../models/fr004.model';
import { MatRadioChange } from '@angular/material/radio';


import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx';

@Component({
    selector: 'fr004-cmp',
    templateUrl: 'fr004.component.html',
    styleUrls: ['fr004.component.css']
})

export class Fr004 implements OnInit {

    fechaExcel = this.datepipe.transform(new Date(), 'dd-MM-yyyy');

    displayedColumnsXAC: string[] = ['xxfc_constantes_cedis_pk', 'creation_date', 'id_ref', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus'];
    headXAC = [['xxfc_constantes_cedis_pk', 'creation_date', 'id_ref', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus']]

    headXACExcel = [['xxmab_repl_item_loc_fr001, 1.1, 1.2', '', '', '', '', 'Fecha creación: ' + this.fechaExcel.toString(), ''],
    ['xxfc_constantes_cedis_pk', 'creation_date', 'id_ref', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus']]

    @ViewChild('PaginatorXAC', { static: true }) paginatorXAC: MatPaginator;
    @ViewChild('SortXAC', { static: true }) sortXAC: MatSort
    dataResponseXAC = null;
    dataResponseTableXAC = null;
    alertSuccessXAC = false;
    alertWarningXAC = false;
    showComponentsXAC = false;
    alertElementsXAC = false;
    numElementsXAC: any;
    showSpinnerXAC = false;
    hideButtonMostarXAC = true;
    responseXAC: any;
    reportPdfXAC = false;
    reportExcelXAC = false;

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

        this.dataResponseTableXAC = [];
        this.numElementsXAC = [];
        this.dataResponseXAC = [];
        this.hideButtonMostarXAC = true;
        this.showComponentsXAC = false;
        this.alertElementsXAC = false;
        this.alertSuccessXAC = false;
        this.alertWarningXAC = false;

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
                url = environment.urlServices + 'fr004/xxmab_xxfc_alertas_cedis_fr004/?fechaInicio=' + fInicio + '&fechaFin=' + fFinal + '&idRef=' + this.idReferencia + '&estatusReg=' + estatusBusuqeda;
            } else {
                url = environment.urlServices + 'fr004/xxmab_xxfc_alertas_cedis_fr004/?fechaInicio=' + fInicio + '&fechaFin=' + fFinal + '&idRef=' + '&estatusReg=' + estatusBusuqeda;
            }

            console.log("url: ", url)

            this.showSpinnerXAC = true;

            this.http.get<any>(url).subscribe(response => {
                console.log(response);
                if (response['count'] > 0) {
                    this.responseXAC = response;
                    this.dataResponseTableXAC = response['items'];
                    this.numElementsXAC = response['count'];
                    this.alertElementsXAC = true;
                } else {
                    this.alertSuccessXAC = true;
                }
                this.showSpinnerXAC = false;
            }, err => {
                this.alertWarningXAC = true;
                this.showSpinnerXAC = false;
            });
        }

    }

    showTableXAC() {
        this.dataResponseXAC = new MatTableDataSource<Fr004Model>(this.responseXAC['items'])
        this.dataResponseXAC.paginator = this.paginatorXAC;
        this.dataResponseXAC.sort = this.sortXAC;
        this.showComponentsXAC = true;
        this.hideButtonMostarXAC = false;
    }

    applyFxacer(event: Event) {
        const fxacerValue = (event.target as HTMLInputElement).value;
        this.dataResponseXAC.fxacer = fxacerValue.trim().toLowerCase();
        console.log(this.dataResponseXAC)
    }

    createPdfXAC() {

        var rows = [];

        this.dataResponseTableXAC.forEach(element => {
            var temp = [element.xxfc_constantes_cedis_pk, element.id_ref, element.creation_date?.substr(0, 10), element.last_update_date, element.last_updated_by, element.comentarios, element.estatus, element.last_update_date, element.last_updated_by, element.comentarios, element.estatus];
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
            head: this.headXAC,
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
        doc1.save('fr004.pdf');
    }

    exportExcelXAC() {

        var rows = [];

        this.dataResponseTableXAC.forEach(element => {
            var temp = [element.xxfc_constantes_cedis_pk, element.id_ref, element.creation_date?.substr(0, 10), element.last_update_date, element.last_updated_by, element.comentarios, element.estatus];
            rows.push(temp);
        })

        var header = this.headXACExcel;

        var wb = XLSX.utils.book_new();
        var ws = XLSX.utils.json_to_sheet(rows);
        XLSX.utils.sheet_add_aoa(ws, header);
        XLSX.utils.book_append_sheet(wb, ws, "fr004.xlsx");
        XLSX.writeFile(wb, "fr004.xlsx");

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

    radioChange(event: MatRadioChange) {
        if (event.value == 'fecha') {
            this.idRef = false
            this.fecha = true
        } else if (event.value == 'idRef') {
            this.fecha = false
            this.idRef = true
        }
    }

    radioChangeReportXAC(event: MatRadioChange) {
        if (event.value == 'pdf') {
            this.reportExcelXAC = false
            this.reportPdfXAC = true
        } else if (event.value == 'excel') {
            this.reportPdfXAC = false
            this.reportExcelXAC = true
        }
    }


    updateEstatusXAC() {
        let fInicio = this.datepipe.transform(this.fechaInicio, 'yyyy-MM-dd');
        let fFinal = this.datepipe.transform(this.fechaFin, 'yyyy-MM-dd');
        this.dialog.open(DialogConfirmXAC, {
            data: { fechaInicial: fInicio, fechaFinal: fFinal }
        });
    }


}

@Component({
    selector: 'dialog-confirmXAC',
    templateUrl: 'dialog-confirmXAC.html',
    styleUrls: ['fr004.component.css']
})
export class DialogConfirmXAC {
    constructor(
        public dialogRef: MatDialogRef<DialogConfirmXAC>,
        @Inject(MAT_DIALOG_DATA) public dataFechas: any,
        private http: HttpClient,
    ) { }

    respuestaSave: any;
    showSpinnerSave = false;
    actualizarButtom = true;

    onNoClick(): void {
        this.dialogRef.close();
    }

    updateEstatusXAC(idRef, comentario) {
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
        this.http.put<any>(environment.urlServices + 'fr004/xxmab_xxfc_alertas_cedis_fr004/', body, { headers })
            .subscribe(data => {
                this.respuestaSave = data.response
                this.showSpinnerSave = false;
                this.actualizarButtom = false;
            });
    }
}