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
import { Fr001Monitoreo4Model } from '../../../models/fr001Monitoreo4.model'
import { MatRadioChange } from '@angular/material/radio';


import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx';

@Component({
    selector: 'fr001Monitoreo4-cmp',
    templateUrl: 'fr001Monitoreo4.component.html',
    styleUrls: ['fr001Monitoreo4.component.css']
})

export class Fr001Monitoreo4 implements OnInit {

    fechaExcel = this.datepipe.transform(new Date(), 'dd-MM-yyyy');

    displayedColumnsIT1: string[] = ['item', 'loc', 'creation_date', 'id_ref', 'seccion', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus'];
    headIT1 = [['item', 'loc', 'creation_date', 'id_ref', 'seccion', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus']];

    headIT1Excel = [['xxmab_repl_item_loc_fr001, 1.1, 1.2', '', '', '', '', '', '', 'Fecha creación: ' + this.fechaExcel.toString(), ''],
    ['item', 'loc', 'creation_date', 'id_ref', 'seccion', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus']]

    @ViewChild('PaginatorIT1', { static: true }) paginatorIT1: MatPaginator;
    @ViewChild('SortIT1', { static: true }) sortIT1: MatSort
    dataResponseIT1 = null;
    dataResponseTableIT1 = null;
    alertSuccessIT1 = false;
    alertWarningIT1 = false;
    showComponentsIT1 = false;
    alertElementsIT1 = false;
    numElementsIT1: any;
    showSpinnerIT1 = false;
    hideButtonMostarIT1 = true;
    responseIT1: any;
    reportPdfIT1 = false;
    reportExcelIT1 = false;

    displayedColumnsIT2: string[] = ['item', 'loc', 'creation_date', 'id_ref', 'seccion', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus'];
    headIT2 = [['item', 'loc', 'creation_date', 'id_ref', 'seccion', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus']];

    headIT2Excel = [['xxmab_repl_item_loc_fr001, 1.1, 1.2', '', '', '', '', '', '', 'Fecha creación: ' + this.fechaExcel.toString(), ''],
    ['item', 'loc', 'creation_date', 'id_ref', 'seccion', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus']]

    @ViewChild('PaginatorIT2', { static: true }) paginatorIT2: MatPaginator;
    @ViewChild('SortIT2', { static: true }) sortIT2: MatSort
    dataResponseIT2 = null;
    dataResponseTableIT2 = null;
    alertSuccessIT2 = false;
    alertWarningIT2 = false;
    showComponentsIT2 = false;
    alertElementsIT2 = false;
    numElementsIT2: any;
    showSpinnerIT2 = false;
    hideButtonMostarIT2 = true;
    responseIT2: any;
    reportPdfIT2 = false;
    reportExcelIT2 = false;

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

        this.dataResponseTableIT1 = [];
        this.numElementsIT1 = [];
        this.dataResponseIT1 = [];
        this.hideButtonMostarIT1 = true;
        this.showComponentsIT1 = false;
        this.alertElementsIT1 = false;
        this.alertSuccessIT1 = false;
        this.alertWarningIT1 = false;

        this.dataResponseTableIT2 = [];
        this.numElementsIT2 = [];
        this.dataResponseIT2 = [];
        this.hideButtonMostarIT2 = true;
        this.showComponentsIT2 = false;
        this.alertElementsIT2 = false;
        this.alertSuccessIT2 = false;
        this.alertWarningIT2 = false;

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

            let fInicio = this.datepipe.transform(this.fechaInicio, 'yyyy-MM-dd');
            let fFinal = this.datepipe.transform(this.fechaFin, 'yyyy-MM-dd');

            var urlIT1 = '';

            if (this.idReferencia != undefined) {
                urlIT1 = environment.urlServices + 'fr001/xxmab_item_loc_1/?fechaInicio=' + fInicio + '&fechaFin=' + fFinal + '&idRef=' + this.idReferencia + '&estatusReg=' + estatusBusuqeda;
            } else {
                urlIT1 = environment.urlServices + 'fr001/xxmab_item_loc_1/?fechaInicio=' + fInicio + '&fechaFin=' + fFinal + '&idRef=' + '&estatusReg=' + estatusBusuqeda;
            }

            this.showSpinnerIT1 = true;

            this.http.get<any>(urlIT1).subscribe(response => {
                console.log(response);
                if (response['count'] > 0) {
                    this.responseIT1 = response;
                    this.dataResponseTableIT1 = response['items'];
                    this.numElementsIT1 = response['count'];
                    this.alertElementsIT1 = true;
                } else {
                    this.alertSuccessIT1 = true;
                }
                this.showSpinnerIT1 = false;
            }, err => {
                this.alertWarningIT1 = true;
                this.showSpinnerIT1 = false;
            });

            //Tabla 2

            var urlurlIT2 = '';

            if (this.idReferencia != undefined) {
                urlurlIT2 = environment.urlServices + 'fr001/xxmab_item_loc_2/?fechaInicio=' + fInicio + '&fechaFin=' + fFinal + '&idRef=' + this.idReferencia + '&estatusReg=' + estatusBusuqeda;
            } else {
                urlurlIT2 = environment.urlServices + 'fr001/xxmab_item_loc_2/?fechaInicio=' + fInicio + '&fechaFin=' + fFinal + '&idRef=' + '&estatusReg=' + estatusBusuqeda;
            }

            this.showSpinnerIT2 = true;

            this.http.get<any>(urlurlIT2).subscribe(response => {
                console.log(response);
                if (response['count'] > 0) {
                    this.responseIT2 = response;
                    this.dataResponseTableIT2 = response['items'];
                    this.numElementsIT2 = response['count'];
                    this.alertElementsIT2 = true;
                } else {
                    this.alertSuccessIT2 = true;
                }
                this.showSpinnerIT2 = false;
            }, err => {
                this.alertWarningIT2 = true;
                this.showSpinnerIT2 = false;
            });
        }

    }

    showTableIT1() {
        this.dataResponseIT1 = new MatTableDataSource<Fr001Monitoreo4Model>(this.responseIT1['items'])
        this.dataResponseIT1.paginator = this.paginatorIT1;
        this.dataResponseIT1.sort = this.sortIT1;
        this.showComponentsIT1 = true;
        this.hideButtonMostarIT1 = false;
    }

    applyFit1erIT1(event: Event) {
        const fit1erValue = (event.target as HTMLInputElement).value;
        this.dataResponseIT1.fit1er = fit1erValue.trim().toLowerCase();
        console.log(this.dataResponseIT1)
    }

    createPdfIT1() {

        var rows = [];

        this.dataResponseTableIT1.forEach(element => {
            var temp = [element.item, element.loc, element.creation_date?.substr(0, 10), element.id_ref, element.seccion, element.last_update_date, element.last_updated_by, element.comentarios, element.estatus];
            rows.push(temp);
        })

        var doc1 = new jsPDF({ orientation: "landscape" });

        doc1.setFontSize(18);
        doc1.text('Monitorear la desactivación/inactivación de liga de cobertura.', 11, 8);
        doc1.setFontSize(11);
        doc1.setTextColor(100);

        let fecha = this.datepipe.transform(new Date(), 'dd-MM-yyyy');

        doc1.text('Fecha creación: ' + fecha.toString(), 240, 8);

        (doc1 as any).autoTable({
            head: this.headIT1,
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
        doc1.save('fr001Modulo3.pdf');
    }

    exportExcelIT1() {

        var rows = [];

        this.dataResponseTableIT1.forEach(element => {
            var temp = [element.item, element.loc, element.creation_date?.substr(0, 10), element.id_ref, element.seccion, element.last_update_date, element.last_updated_by, element.comentarios, element.estatus];
            rows.push(temp);
        })

        var header = this.headIT1Excel;

        var wb = XLSX.utils.book_new();
        var ws = XLSX.utils.json_to_sheet(rows);
        XLSX.utils.sheet_add_aoa(ws, header);
        XLSX.utils.book_append_sheet(wb, ws, "fr001Modulo3.xlsx");
        XLSX.writeFile(wb, "fr001Modulo3.xlsx");

    }

    //tabla 2

    showTableIT2() {
        this.dataResponseIT2 = new MatTableDataSource<Fr001Monitoreo4Model>(this.responseIT2['items'])
        this.dataResponseIT2.paginator = this.paginatorIT2;
        this.dataResponseIT2.sort = this.sortIT2;
        this.showComponentsIT2 = true;
        this.hideButtonMostarIT2 = false;
    }

    applyFit1erIT2(event: Event) {
        const fit1erValue = (event.target as HTMLInputElement).value;
        this.dataResponseIT2.fit1er = fit1erValue.trim().toLowerCase();
        console.log(this.dataResponseIT2)
    }

    createPdfIT2() {

        var rows = [];

        this.dataResponseTableIT2.forEach(element => {
            var temp = [element.item, element.loc, element.creation_date?.substr(0, 10), element.id_ref, element.seccion, element.last_update_date, element.last_updated_by, element.comentarios, element.estatus];
            rows.push(temp);
        })

        var doc1 = new jsPDF({ orientation: "landscape" });

        doc1.setFontSize(18);
        doc1.text('Monitorear la desactivación/inactivación de liga de cobertura.', 11, 8);
        doc1.setFontSize(11);
        doc1.setTextColor(100);

        let fecha = this.datepipe.transform(new Date(), 'dd-MM-yyyy');

        doc1.text('Fecha creación: ' + fecha.toString(), 240, 8);

        (doc1 as any).autoTable({
            head: this.headIT2,
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
        doc1.save('fr001Modulo4.pdf');
    }

    exportExcelIT2() {

        var rows = [];

        this.dataResponseTableIT2.forEach(element => {
            var temp = [element.item, element.loc, element.creation_date?.substr(0, 10), element.id_ref, element.seccion, element.last_update_date, element.last_updated_by, element.comentarios, element.estatus];
            rows.push(temp);
        })

        var header = this.headIT2Excel;

        var wb = XLSX.utils.book_new();
        var ws = XLSX.utils.json_to_sheet(rows);
        XLSX.utils.sheet_add_aoa(ws, header);
        XLSX.utils.book_append_sheet(wb, ws, "fr001Modulo4.xlsx");
        XLSX.writeFile(wb, "fr001Modulo4.xlsx");

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

    radioChangeReportIT1(event: MatRadioChange) {
        if (event.value == 'pdf') {
            this.reportExcelIT1 = false
            this.reportPdfIT1 = true
        } else if (event.value == 'excel') {
            this.reportPdfIT1 = false
            this.reportExcelIT1 = true
        }
    }

    radioChangeReportIT2(event: MatRadioChange) {
        if (event.value == 'pdf') {
            this.reportExcelIT2 = false
            this.reportPdfIT2 = true
        } else if (event.value == 'excel') {
            this.reportPdfIT2 = false
            this.reportExcelIT2 = true
        }
    }


    updateEstatusIT1() {
        let fInicio = this.datepipe.transform(this.fechaInicio, 'yyyy-MM-dd');
        let fFinal = this.datepipe.transform(this.fechaFin, 'yyyy-MM-dd');
        this.dialog.open(DialogConfirmIT1, {
            data: { fechaInicial: fInicio, fechaFinal: fFinal }
        });
    }

    updateEstatusIT2() {
        let fInicio = this.datepipe.transform(this.fechaInicio, 'yyyy-MM-dd');
        let fFinal = this.datepipe.transform(this.fechaFin, 'yyyy-MM-dd');
        this.dialog.open(DialogConfirmIT2, {
            data: { fechaInicial: fInicio, fechaFinal: fFinal }
        });
    }

}

@Component({
    selector: 'dialog-confirmIT1',
    templateUrl: 'dialog-confirmIT1.html',
    styleUrls: ['fr001Monitoreo4.component.css']
})
export class DialogConfirmIT1 {
    constructor(
        public dialogRef: MatDialogRef<DialogConfirmIT1>,
        @Inject(MAT_DIALOG_DATA) public dataFechas: any,
        private http: HttpClient,
    ) { }

    respuestaSave: any;
    showSpinnerSave = false;
    actualizarButtom = true;

    onNoClick(): void {
        this.dialogRef.close();
    }

    updateEstatusIT1(idRef, comentario) {
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
        this.http.put<any>(environment.urlServices + 'fr001/xxmab_item_loc_1/', body, { headers })
            .subscribe(data => {
                this.respuestaSave = data.response
                this.showSpinnerSave = false;
                this.actualizarButtom = false;
            });
    }
}

@Component({
    selector: 'dialog-confirmIT2',
    templateUrl: 'dialog-confirmIT2.html',
    styleUrls: ['fr001Monitoreo4.component.css']
})
export class DialogConfirmIT2 {
    constructor(
        public dialogRef: MatDialogRef<DialogConfirmIT2>,
        @Inject(MAT_DIALOG_DATA) public dataFechas: any,
        private http: HttpClient,
    ) { }

    respuestaSave: any;
    showSpinnerSave = false;
    actualizarButtom = true;

    onNoClick(): void {
        this.dialogRef.close();
    }

    updateEstatusIT2(idRef, comentario) {
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
        this.http.put<any>(environment.urlServices + 'fr001/xxmab_item_loc_2/', body, { headers })
            .subscribe(data => {
                this.respuestaSave = data.response
                this.showSpinnerSave = false;
                this.actualizarButtom = false;
            });
    }
}