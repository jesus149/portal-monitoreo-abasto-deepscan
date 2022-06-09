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
import { Fr005Monitoreo2Model } from '../../../models/fr005Monitoreo2.model'
import { MatRadioChange } from '@angular/material/radio';


import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx';

@Component({
    selector: 'fr005Monitoreo2-cmp',
    templateUrl: 'fr005Monitoreo2.component.html',
    styleUrls: ['fr005Monitoreo2.component.css']
})

export class Fr005Monitoreo2 implements OnInit {

    fechaExcel = this.datepipe.transform(new Date(), 'dd-MM-yyyy');

    displayedColumnsIS1: string[] = ['item', 'supplier', 'creation_date', 'id_ref', 'seccion', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus'];
    headIS1 = [['item', 'supplier', 'creation_date', 'id_ref', 'seccion', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus']];

    headIS1DExcel = [['xxmab_repl_item_loc_fr001, 1.1, 1.2', '', '', '', '', '', '', 'Fecha creación: ' + this.fechaExcel.toString(), ''],
    ['item', 'supplier', 'creation_date', 'id_ref', 'seccion', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus']]

    @ViewChild('PaginatorIS1', { static: true }) paginatorIS1: MatPaginator;
    @ViewChild('SortIS1', { static: true }) sortIS1: MatSort
    dataResponseIS1 = null;
    dataResponseTableIS1 = null;
    alertSuccessIS1 = false;
    alertWarningIS1 = false;
    showComponentsIS1 = false;
    alertElementsIS1 = false;
    numElementsIS1: any;
    showSpinnerIS1 = false;
    hideButtonMostarIS1 = true;
    responseIS1: any;

    displayedColumnsIS2: string[] = ['item', 'supplier', 'creation_date', 'id_ref', 'seccion', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus'];
    headIS2 = [['item', 'supplier', 'creation_date', 'id_ref', 'seccion', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus']];

    headIS2DExcel = [['xxmab_repl_item_loc_fr001, 1.1, 1.2', '', '', '', '', '', '', 'Fecha creación: ' + this.fechaExcel.toString(), ''],
    ['item', 'supplier', 'creation_date', 'id_ref', 'seccion', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus']]

    @ViewChild('PaginatorIS2', { static: true }) paginatorIS2: MatPaginator;
    @ViewChild('SortIS2', { static: true }) sortIS2: MatSort
    dataResponseIS2 = null;
    dataResponseTableIS2 = null;
    alertSuccessIS2 = false;
    alertWarningIS2 = false;
    showComponentsIS2 = false;
    alertElementsIS2 = false;
    numElementsIS2: any;
    showSpinnerIS2 = false;
    hideButtonMostarIS2 = true;
    responseIS2: any;

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

        this.dataResponseTableIS1 = [];
        this.numElementsIS1 = [];
        this.dataResponseIS1 = [];
        this.hideButtonMostarIS1 = true;
        this.showComponentsIS1 = false;
        this.alertElementsIS1 = false;
        this.alertSuccessIS1 = false;
        this.alertWarningIS1 = false;

        this.dataResponseTableIS2 = [];
        this.numElementsIS2 = [];
        this.dataResponseIS2 = [];
        this.hideButtonMostarIS2 = true;
        this.showComponentsIS2 = false;
        this.alertElementsIS2 = false;
        this.alertSuccessIS2 = false;
        this.alertWarningIS2 = false;

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

            var urlIS1 = '';

            if (this.idReferencia != undefined) {
                urlIS1 = environment.urlServices + 'fr005/xxmab_item_supplier_fr005_1/?fechaInicio=' + fInicio + '&fechaFin=' + fFinal + '&idRef=' + this.idReferencia + '&estatusReg=' + estatusBusuqeda;
            } else {
                urlIS1 = environment.urlServices + 'fr005/xxmab_item_supplier_fr005_1/?fechaInicio=' + fInicio + '&fechaFin=' + fFinal + '&idRef=' + '&estatusReg=' + estatusBusuqeda;
            }

            this.showSpinnerIS1 = true;

            this.http.get<any>(urlIS1).subscribe(response => {
                console.log(response);
                if (response['count'] > 0) {
                    this.responseIS1 = response;
                    this.dataResponseTableIS1 = response['items'];
                    this.numElementsIS1 = response['count'];
                    this.alertElementsIS1 = true;
                } else {
                    this.alertSuccessIS1 = true;
                }
                this.showSpinnerIS1 = false;
            }, err => {
                this.alertWarningIS1 = true;
                this.showSpinnerIS1 = false;
            });

            //Tabla 2

            var urlIS2 = '';

            if (this.idReferencia != undefined) {
                urlIS2 = environment.urlServices + 'fr005/xxmab_item_supplier_fr005_2/?fechaInicio=' + fInicio + '&fechaFin=' + fFinal + '&idRef=' + this.idReferencia + '&estatusReg=' + estatusBusuqeda;
            } else {
                urlIS2 = environment.urlServices + 'fr005/xxmab_item_supplier_fr005_2/?fechaInicio=' + fInicio + '&fechaFin=' + fFinal + '&idRef=' + '&estatusReg=' + estatusBusuqeda;
            }

            this.showSpinnerIS2 = true;

            this.http.get<any>(urlIS2).subscribe(response => {
                console.log(response);
                if (response['count'] > 0) {
                    this.responseIS2 = response;
                    this.dataResponseTableIS2 = response['items'];
                    this.numElementsIS2 = response['count'];
                    this.alertElementsIS2 = true;
                } else {
                    this.alertSuccessIS2 = true;
                }
                this.showSpinnerIS2 = false;
            }, err => {
                this.alertWarningIS2 = true;
                this.showSpinnerIS2 = false;
            });

        }

    }

    showTableIS1() {
        this.dataResponseIS1 = new MatTableDataSource<Fr005Monitoreo2Model>(this.responseIS1['items'])
        this.dataResponseIS1.paginator = this.paginatorIS1;
        this.dataResponseIS1.sort = this.sortIS1;
        this.showComponentsIS1 = true;
        this.hideButtonMostarIS1 = false;
    }

    applyFit1erIS1(event: Event) {
        const fit1erValue = (event.target as HTMLInputElement).value;
        this.dataResponseIS1.fit1er = fit1erValue.trim().toLowerCase();
        console.log(this.dataResponseIS1)
    }

    createPdfIS1() {

        var rows = [];

        this.dataResponseTableIS1.forEach(element => {
            var temp = [element.item, element.supplier, element.creation_date?.substr(0, 10), element.id_ref, element.seccion, element.last_update_date, element.last_updated_by, element.comentarios, element.estatus];
            rows.push(temp);
        })

        var doc1 = new jsPDF({ orientation: "landscape" });

        doc1.setFontSize(18);
        doc1.text('Replica de informacion de DAS a RMS10.', 11, 8);
        doc1.setFontSize(11);
        doc1.setTextColor(100);

        let fecha = this.datepipe.transform(new Date(), 'dd-MM-yyyy');

        doc1.text('Fecha creación: ' + fecha.toString(), 240, 8);

        (doc1 as any).autoTable({
            head: this.headIS1,
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
        doc1.save('fr005Modulo2.pdf');
    }

    exportExcelIS1() {

        var rows = [];

        this.dataResponseTableIS1.forEach(element => {
            var temp = [element.item, element.supplier, element.creation_date?.substr(0, 10), element.id_ref, element.seccion, element.last_update_date, element.last_updated_by, element.comentarios, element.estatus];
            rows.push(temp);
        })

        var header = this.headIS1DExcel;

        var wb = XLSX.utils.book_new();
        var ws = XLSX.utils.json_to_sheet(rows);
        XLSX.utils.sheet_add_aoa(ws, header);
        XLSX.utils.book_append_sheet(wb, ws, "fr005Modulo2.xlsx");
        XLSX.writeFile(wb, "fr005Modulo2.xlsx");

    }

    //tabla 2

    showTableIS2() {
        this.dataResponseIS2 = new MatTableDataSource<Fr005Monitoreo2Model>(this.responseIS2['items'])
        this.dataResponseIS2.paginator = this.paginatorIS2;
        this.dataResponseIS2.sort = this.sortIS2;
        this.showComponentsIS2 = true;
        this.hideButtonMostarIS2 = false;
    }

    applyFit1erIS2(event: Event) {
        const fit1erValue = (event.target as HTMLInputElement).value;
        this.dataResponseIS2.fit1er = fit1erValue.trim().toLowerCase();
        console.log(this.dataResponseIS2)
    }

    createPdfIS2() {

        var rows = [];

        this.dataResponseTableIS2.forEach(element => {
            var temp = [element.item, element.supplier, element.creation_date?.substr(0, 10), element.id_ref, element.seccion, element.last_update_date, element.last_updated_by, element.comentarios, element.estatus];
            rows.push(temp);
        })

        var doc1 = new jsPDF({ orientation: "landscape" });

        doc1.setFontSize(18);
        doc1.text('Replica de informacion de DAS a RMS10.', 11, 8);
        doc1.setFontSize(11);
        doc1.setTextColor(100);

        let fecha = this.datepipe.transform(new Date(), 'dd-MM-yyyy');

        doc1.text('Fecha creación: ' + fecha.toString(), 240, 8);

        (doc1 as any).autoTable({
            head: this.headIS2,
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
        doc1.save('fr005Modulo2.pdf');
    }

    exportExcelIS2() {

        var rows = [];

        this.dataResponseTableIS2.forEach(element => {
            var temp = [element.item, element.supplier, element.creation_date?.substr(0, 10), element.id_ref, element.seccion, element.last_update_date, element.last_updated_by, element.comentarios, element.estatus];
            rows.push(temp);
        })

        var header = this.headIS2DExcel;

        var wb = XLSX.utils.book_new();
        var ws = XLSX.utils.json_to_sheet(rows);
        XLSX.utils.sheet_add_aoa(ws, header);
        XLSX.utils.book_append_sheet(wb, ws, "fr005Modulo4.xlsx");
        XLSX.writeFile(wb, "fr005Modulo2.xlsx");

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


    updateEstatusIS1() {
        let fInicio = this.datepipe.transform(this.fechaInicio, 'yyyy-MM-dd');
        let fFinal = this.datepipe.transform(this.fechaFin, 'yyyy-MM-dd');
        this.dialog.open(DialogConfirmIS1, {
            data: { fechaInicial: fInicio, fechaFinal: fFinal }
        });
    }

    updateEstatusIS2() {
        let fInicio = this.datepipe.transform(this.fechaInicio, 'yyyy-MM-dd');
        let fFinal = this.datepipe.transform(this.fechaFin, 'yyyy-MM-dd');
        this.dialog.open(DialogConfirmIS2, {
            data: { fechaInicial: fInicio, fechaFinal: fFinal }
        });
    }


}

@Component({
    selector: 'dialog-confirmIS1',
    templateUrl: 'dialog-confirmIS1.html',
    styleUrls: ['fr005Monitoreo2.component.css']
})
export class DialogConfirmIS1 {
    constructor(
        public dialogRef: MatDialogRef<DialogConfirmIS1>,
        @Inject(MAT_DIALOG_DATA) public dataFechas: any,
        private http: HttpClient,
    ) { }

    respuestaSave: any;
    showSpinnerSave = false;
    actualizarButtom = true;

    onNoClick(): void {
        this.dialogRef.close();
    }

    updateEstatusIS1(idRef, comentario) {
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
        this.http.put<any>(environment.urlServices + 'fr005/xxmab_item_supplier_fr005_1/', body, { headers })
            .subscribe(data => {
                this.respuestaSave = data.response
                this.showSpinnerSave = false;
                this.actualizarButtom = false;
            });
    }
}

@Component({
    selector: 'dialog-confirmIS2',
    templateUrl: 'dialog-confirmIS2.html',
    styleUrls: ['fr005Monitoreo2.component.css']
})
export class DialogConfirmIS2 {
    constructor(
        public dialogRef: MatDialogRef<DialogConfirmIS2>,
        @Inject(MAT_DIALOG_DATA) public dataFechas: any,
        private http: HttpClient,
    ) { }

    respuestaSave: any;
    showSpinnerSave = false;
    actualizarButtom = true;

    onNoClick(): void {
        this.dialogRef.close();
    }

    updateEstatusIS2(idRef, comentario) {
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
        this.http.put<any>(environment.urlServices + 'fr005/xxmab_item_supplier_fr005_2/', body, { headers })
            .subscribe(data => {
                this.respuestaSave = data.response
                this.showSpinnerSave = false;
                this.actualizarButtom = false;
            });
    }
}