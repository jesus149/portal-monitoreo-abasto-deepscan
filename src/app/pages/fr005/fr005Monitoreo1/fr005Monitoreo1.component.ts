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
import { Fr005Monitoreo1Model } from '../../../models/fr005Monitoreo1.model'
import { MatRadioChange } from '@angular/material/radio';


import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx';

@Component({
    selector: 'fr005Monitoreo1-cmp',
    templateUrl: 'fr005Monitoreo1.component.html',
    styleUrls: ['fr005Monitoreo1.component.css']
})

export class Fr005Monitoreo1 implements OnInit {

    fechaExcel = this.datepipe.transform(new Date(), 'dd-MM-yyyy');

    displayedColumnsISC1: string[] = ['item', 'supplier', 'origin_country_id', 'creation_date', 'id_ref', 'seccion', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus'];
    headISC1 = [['item', 'supplier', 'origin_country_id', 'creation_date', 'id_ref', 'seccion', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus']];

    headISC1Excel = [['xxmab_repl_item_loc_fr001, 1.1, 1.2', '', '', '', '', '', '', '', 'Fecha creación: ' + this.fechaExcel.toString(), ''],
    ['item', 'supplier', 'origin_country_id', 'creation_date', 'id_ref', 'seccion', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus']]

    @ViewChild('PaginatorISC1', { static: true }) paginatorISC1: MatPaginator;
    @ViewChild('SortISC1', { static: true }) sortISC1: MatSort
    dataResponseISC1 = null;
    dataResponseTableISC1 = null;
    alertSuccessISC1 = false;
    alertWarningISC1 = false;
    showComponentsISC1 = false;
    alertElementsISC1 = false;
    numElementsISC1: any;
    showSpinnerISC1 = false;
    hideButtonMostarISC1 = true;
    responseISC1: any;
    reportPdfISC1 = false;
    reportExcelISC1 = false;

    displayedColumnsISC2: string[] = ['item', 'supplier', 'origin_country_id', 'creation_date', 'id_ref', 'seccion', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus'];;
    headISC2 = [['item', 'supplier', 'origin_country_id', 'creation_date', 'id_ref', 'seccion', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus']];

    headISC2Excel = [['xxmab_repl_item_loc_fr001, 1.1, 1.2', '', '', '', '', '', '', '', 'Fecha creación: ' + this.fechaExcel.toString(), ''],
    ['item', 'supplier', 'origin_country_id', 'creation_date', 'id_ref', 'seccion', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus']]

    @ViewChild('PaginatorISC2', { static: true }) paginatorISC2: MatPaginator;
    @ViewChild('SortISC2', { static: true }) sortISC2: MatSort
    dataResponseISC2 = null;
    dataResponseTableISC2 = null;
    alertSuccessISC2 = false;
    alertWarningISC2 = false;
    showComponentsISC2 = false;
    alertElementsISC2 = false;
    numElementsISC2: any;
    showSpinnerISC2 = false;
    hideButtonMostarISC2 = true;
    responseISC2: any;
    reportPdfISC2 = false;
    reportExcelISC2 = false;

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

        this.dataResponseTableISC1 = [];
        this.numElementsISC1 = [];
        this.dataResponseISC1 = [];
        this.hideButtonMostarISC1 = true;
        this.showComponentsISC1 = false;
        this.alertElementsISC1 = false;
        this.alertSuccessISC1 = false;
        this.alertWarningISC1 = false;

        this.dataResponseTableISC2 = [];
        this.numElementsISC2 = [];
        this.dataResponseISC2 = [];
        this.hideButtonMostarISC2 = true;
        this.showComponentsISC2 = false;
        this.alertElementsISC2 = false;
        this.alertSuccessISC2 = false;
        this.alertWarningISC2 = false;

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

            var urlISC1 = '';

            if (this.idReferencia != undefined) {
                urlISC1 = environment.urlServices + 'fr005/xxmab_item_supp_country_fr005_1/?fechaInicio=' + fInicio + '&fechaFin=' + fFinal + '&idRef=' + this.idReferencia + '&estatusReg=' + estatusBusuqeda;
            } else {
                urlISC1 = environment.urlServices + 'fr005/xxmab_item_supp_country_fr005_1/?fechaInicio=' + fInicio + '&fechaFin=' + fFinal + '&idRef=' + '&estatusReg=' + estatusBusuqeda;
            }

            this.showSpinnerISC1 = true;

            this.http.get<any>(urlISC1).subscribe(response => {
                console.log(response);
                if (response['count'] > 0) {
                    this.responseISC1 = response;
                    this.dataResponseTableISC1 = response['items'];
                    this.numElementsISC1 = response['count'];
                    this.alertElementsISC1 = true;
                } else {
                    this.alertSuccessISC1 = true;
                }
                this.showSpinnerISC1 = false;
            }, err => {
                this.alertWarningISC1 = true;
                this.showSpinnerISC1 = false;
            });

            //Tabla 2

            var urlISC2 = '';

            if (this.idReferencia != undefined) {
                urlISC2 = environment.urlServices + 'fr005/xxmab_item_supp_country_fr005_2/?fechaInicio=' + fInicio + '&fechaFin=' + fFinal + '&idRef=' + this.idReferencia + '&estatusReg=' + estatusBusuqeda;
            } else {
                urlISC2 = environment.urlServices + 'fr005/xxmab_item_supp_country_fr005_2/?fechaInicio=' + fInicio + '&fechaFin=' + fFinal + '&idRef=' + '&estatusReg=' + estatusBusuqeda;
            }

            this.showSpinnerISC2 = true;

            this.http.get<any>(urlISC2).subscribe(response => {
                console.log(response);
                if (response['count'] > 0) {
                    this.responseISC2 = response;
                    this.dataResponseTableISC2 = response['items'];
                    this.numElementsISC2 = response['count'];
                    this.alertElementsISC2 = true;
                } else {
                    this.alertSuccessISC2 = true;
                }
                this.showSpinnerISC2 = false;
            }, err => {
                this.alertWarningISC2 = true;
                this.showSpinnerISC2 = false;
            });
        }

    }

    showTableISC1() {
        this.dataResponseISC1 = new MatTableDataSource<Fr005Monitoreo1Model>(this.responseISC1['items'])
        this.dataResponseISC1.paginator = this.paginatorISC1;
        this.dataResponseISC1.sort = this.sortISC1;
        this.showComponentsISC1 = true;
        this.hideButtonMostarISC1 = false;
    }

    applyFit1erISC1(event: Event) {
        const fit1erValue = (event.target as HTMLInputElement).value;
        this.dataResponseISC1.fit1er = fit1erValue.trim().toLowerCase();
        console.log(this.dataResponseISC1)
    }

    createPdfISC1() {

        var rows = [];

        this.dataResponseTableISC1.forEach(element => {
            var temp = [element.item, element.supplier, element.origin_country_id, element.creation_date?.substr(0, 10), element.id_ref, element.seccion, element.last_update_date, element.last_updated_by, element.comentarios, element.estatus];
            rows.push(temp);
        })

        var doc1 = new jsPDF({ orientation: "landscape" });

        doc1.setFontSize(18);
        doc1.text('Replica de informacion de RMS16 a DAS.', 11, 8);
        doc1.setFontSize(11);
        doc1.setTextColor(100);

        let fecha = this.datepipe.transform(new Date(), 'dd-MM-yyyy');

        doc1.text('Fecha creación: ' + fecha.toString(), 240, 8);

        (doc1 as any).autoTable({
            head: this.headISC1,
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
        doc1.save('fr005Modulo1.pdf');
    }

    exportExcelISC1() {

        var rows = [];

        this.dataResponseTableISC1.forEach(element => {
            var temp = [element.item, element.supplier, element.origin_country_id, element.creation_date?.substr(0, 10), element.id_ref, element.seccion, element.last_update_date, element.last_updated_by, element.comentarios, element.estatus];
            rows.push(temp);
        })

        var header = this.headISC1Excel;

        var wb = XLSX.utils.book_new();
        var ws = XLSX.utils.json_to_sheet(rows);
        XLSX.utils.sheet_add_aoa(ws, header);
        XLSX.utils.book_append_sheet(wb, ws, "fr005Modulo1.xlsx");
        XLSX.writeFile(wb, "fr005Modulo1.xlsx");

    }

    //tabla 2

    showTableISC2() {
        this.dataResponseISC2 = new MatTableDataSource<Fr005Monitoreo1Model>(this.responseISC2['items'])
        this.dataResponseISC2.paginator = this.paginatorISC2;
        this.dataResponseISC2.sort = this.sortISC2;
        this.showComponentsISC2 = true;
        this.hideButtonMostarISC2 = false;
    }

    applyFit1erISC2(event: Event) {
        const fit1erValue = (event.target as HTMLInputElement).value;
        this.dataResponseISC2.fit1er = fit1erValue.trim().toLowerCase();
        console.log(this.dataResponseISC2)
    }

    createPdfISC2() {

        var rows = [];

        this.dataResponseTableISC2.forEach(element => {
            var temp = [element.item, element.supplier, element.origin_country_id, element.creation_date?.substr(0, 10), element.id_ref, element.seccion, element.last_update_date, element.last_updated_by, element.comentarios, element.estatus];
            rows.push(temp);
        })

        var doc1 = new jsPDF({ orientation: "landscape" });

        doc1.setFontSize(18);
        doc1.text('Replica de informacion de RMS16 a DAS.', 11, 8);
        doc1.setFontSize(11);
        doc1.setTextColor(100);

        let fecha = this.datepipe.transform(new Date(), 'dd-MM-yyyy');

        doc1.text('Fecha creación: ' + fecha.toString(), 240, 8);

        (doc1 as any).autoTable({
            head: this.headISC2,
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
        doc1.save('fr005Modulo1.pdf');
    }

    exportExcelISC2() {

        var rows = [];

        this.dataResponseTableISC2.forEach(element => {
            var temp = [element.item, element.supplier, element.origin_country_id, element.creation_date?.substr(0, 10), element.id_ref, element.seccion, element.last_update_date, element.last_updated_by, element.comentarios, element.estatus];
            rows.push(temp);
        })

        var header = this.headISC2Excel;

        var wb = XLSX.utils.book_new();
        var ws = XLSX.utils.json_to_sheet(rows);
        XLSX.utils.sheet_add_aoa(ws, header);
        XLSX.utils.book_append_sheet(wb, ws, "fr005Modulo1.xlsx");
        XLSX.writeFile(wb, "fr005Modulo1.xlsx");

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

    radioChangeReportISC1(event: MatRadioChange) {
        if (event.value == 'pdf') {
            this.reportExcelISC1 = false
            this.reportPdfISC1 = true
        } else if (event.value == 'excel') {
            this.reportPdfISC1 = false
            this.reportExcelISC1 = true
        }
    }

    radioChangeReportISC2(event: MatRadioChange) {
        if (event.value == 'pdf') {
            this.reportExcelISC2 = false
            this.reportPdfISC2 = true
        } else if (event.value == 'excel') {
            this.reportPdfISC2 = false
            this.reportExcelISC2 = true
        }
    }



    updateEstatusISC1() {
        let fInicio = this.datepipe.transform(this.fechaInicio, 'yyyy-MM-dd');
        let fFinal = this.datepipe.transform(this.fechaFin, 'yyyy-MM-dd');
        this.dialog.open(DialogConfirmISC1, {
            data: { fechaInicial: fInicio, fechaFinal: fFinal }
        });
    }

    updateEstatusISC2() {
        let fInicio = this.datepipe.transform(this.fechaInicio, 'yyyy-MM-dd');
        let fFinal = this.datepipe.transform(this.fechaFin, 'yyyy-MM-dd');
        this.dialog.open(DialogConfirmISC2, {
            data: { fechaInicial: fInicio, fechaFinal: fFinal }
        });
    }


}


@Component({
    selector: 'dialog-confirmISC1',
    templateUrl: 'dialog-confirmISC1.html',
    styleUrls: ['fr005Monitoreo1.component.css']
})
export class DialogConfirmISC1 {
    constructor(
        public dialogRef: MatDialogRef<DialogConfirmISC1>,
        @Inject(MAT_DIALOG_DATA) public dataFechas: any,
        private http: HttpClient,
    ) { }

    respuestaSave: any;
    showSpinnerSave = false;
    actualizarButtom = true;

    onNoClick(): void {
        this.dialogRef.close();
    }

    updateEstatusISC1(idRef, comentario) {
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
        this.http.put<any>(environment.urlServices + 'fr005/xxmab_item_supp_country_fr005_1/', body, { headers })
            .subscribe(data => {
                this.respuestaSave = data.response
                this.showSpinnerSave = false;
                this.actualizarButtom = false;
            });
    }
}

@Component({
    selector: 'dialog-confirmISC2',
    templateUrl: 'dialog-confirmISC2.html',
    styleUrls: ['fr005Monitoreo1.component.css']
})
export class DialogConfirmISC2 {
    constructor(
        public dialogRef: MatDialogRef<DialogConfirmISC2>,
        @Inject(MAT_DIALOG_DATA) public dataFechas: any,
        private http: HttpClient,
    ) { }

    respuestaSave: any;
    showSpinnerSave = false;
    actualizarButtom = true;

    onNoClick(): void {
        this.dialogRef.close();
    }

    updateEstatusISC2(idRef, comentario) {
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
        this.http.put<any>(environment.urlServices + 'fr005/xxmab_item_supp_country_fr005_2/', body, { headers })
            .subscribe(data => {
                this.respuestaSave = data.response
                this.showSpinnerSave = false;
                this.actualizarButtom = false;
            });
    }
}
