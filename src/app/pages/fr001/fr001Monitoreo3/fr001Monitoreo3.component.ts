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
import { Fr001Monitoreo3Model } from '../../../models/fr001Monitoreo3.model'
import { MatRadioChange } from '@angular/material/radio';


import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx';

@Component({
    selector: 'fr001Monitoreo3-cmp',
    templateUrl: 'fr001Monitoreo3.component.html',
    styleUrls: ['fr001Monitoreo3.component.css']
})

export class Fr001Monitoreo3 implements OnInit {

    fechaExcel = this.datepipe.transform(new Date(), 'dd-MM-yyyy');

    displayedColumnsILT: string[] = ['item', 'loc', 'creation_date', 'id_ref', 'seccion', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus'];
    headILT = [['item', 'loc', 'creation_date', 'id_ref', 'seccion', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus']];

    headILExcel = [['xxmab_repl_item_loc_fr001, 1.1, 1.2', '', '', '', '', '', '', 'Fecha creación: ' + this.fechaExcel.toString(), ''],
    ['item', 'loc', 'creation_date', 'id_ref', 'seccion', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus']]

    @ViewChild('PaginatorILT', { static: true }) paginatorILT: MatPaginator;
    @ViewChild('SortILT', { static: true }) sortILT: MatSort
    dataResponseILT = null;
    dataResponseTableILT = null;
    alertSuccessILT = false;
    alertWarningILT = false;
    showComponentsILT = false;
    alertElementsILT = false;
    numElementsILT: any;
    showSpinnerILT = false;
    hideButtonMostarILT = true;
    responseILT: any;
    reportPdfILT = false;
    reportExcelILT = false;

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

        this.dataResponseTableILT = [];
        this.numElementsILT = [];
        this.dataResponseILT = [];
        this.hideButtonMostarILT = true;
        this.showComponentsILT = false;
        this.alertElementsILT = false;
        this.alertSuccessILT = false;
        this.alertWarningILT = false;

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
                url = environment.urlServices + 'fr001/xxmab_item_loc_traits/?fechaInicio=' + fInicio + '&fechaFin=' + fFinal + '&idRef=' + this.idReferencia + '&estatusReg=' + estatusBusuqeda;
            } else {
                url = environment.urlServices + 'fr001/xxmab_item_loc_traits/?fechaInicio=' + fInicio + '&fechaFin=' + fFinal + '&idRef=' + '&estatusReg=' + estatusBusuqeda;
            }

            this.showSpinnerILT = true;

            this.http.get<any>(url).subscribe(response => {
                console.log(response);
                if (response['count'] > 0) {
                    this.responseILT = response;
                    this.dataResponseTableILT = response['items'];
                    this.numElementsILT = response['count'];
                    this.alertElementsILT = true;
                } else {
                    this.alertSuccessILT = true;
                }
                this.showSpinnerILT = false;
            }, err => {
                this.alertWarningILT = true;
                this.showSpinnerILT = false;
            });
        }

    }

    showTableILT() {
        this.dataResponseILT = new MatTableDataSource<Fr001Monitoreo3Model>(this.responseILT['items'])
        this.dataResponseILT.paginator = this.paginatorILT;
        this.dataResponseILT.sort = this.sortILT;
        this.showComponentsILT = true;
        this.hideButtonMostarILT = false;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataResponseILT.filter = filterValue.trim().toLowerCase();
        console.log(this.dataResponseILT)
    }

    createPdfILT() {

        var rows = [];

        this.dataResponseTableILT.forEach(element => {
            var temp = [element.item, element.loc, element.creation_date?.substr(0, 10), element.id_ref, element.seccion, element.last_update_date, element.last_updated_by, element.comentarios, element.estatus];
            rows.push(temp);
        })

        var doc1 = new jsPDF({ orientation: "landscape" });

        doc1.setFontSize(18);
        doc1.text('Monitorear el valor del SOM de la liga de cobertura contra el SOM de la liga replenishment.', 11, 8);
        doc1.setFontSize(11);
        doc1.setTextColor(100);

        let fecha = this.datepipe.transform(new Date(), 'dd-MM-yyyy');

        doc1.text('Fecha creación: ' + fecha.toString(), 240, 8);

        (doc1 as any).autoTable({
            head: this.headILT,
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

    exportExcelILT() {

        var rows = [];

        this.dataResponseTableILT.forEach(element => {
            var temp = [element.item, element.loc, element.creation_date?.substr(0, 10), element.id_ref, element.seccion, element.last_update_date, element.last_updated_by, element.comentarios, element.estatus];
            rows.push(temp);
        })

        var header = this.headILExcel;

        var wb = XLSX.utils.book_new();
        var ws = XLSX.utils.json_to_sheet(rows);
        XLSX.utils.sheet_add_aoa(ws, header);
        XLSX.utils.book_append_sheet(wb, ws, "fr001Modulo3.xlsx");
        XLSX.writeFile(wb, "fr001Modulo3.xlsx");

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

    radioChangeReportILT(event: MatRadioChange) {
        if (event.value == 'pdf') {
            this.reportExcelILT = false
            this.reportPdfILT = true
        } else if (event.value == 'excel') {
            this.reportPdfILT = false
            this.reportExcelILT = true
        }
    }


    updateEstatusILT() {
        let fInicio = this.datepipe.transform(this.fechaInicio, 'yyyy-MM-dd');
        let fFinal = this.datepipe.transform(this.fechaFin, 'yyyy-MM-dd');
        this.dialog.open(DialogConfirmILT, {
            data: { fechaInicial: fInicio, fechaFinal: fFinal }
        });
    }


}

@Component({
    selector: 'dialog-confirmILT',
    templateUrl: 'dialog-confirmILT.html',
    styleUrls: ['fr001Monitoreo3.component.css']
})
export class DialogConfirmILT {
    constructor(
        public dialogRef: MatDialogRef<DialogConfirmILT>,
        @Inject(MAT_DIALOG_DATA) public dataFechas: any,
        private http: HttpClient,
    ) { }

    respuestaSave: any;
    showSpinnerSave = false;
    actualizarButtom = true;

    onNoClick(): void {
        this.dialogRef.close();
    }

    updateEstatusILT(idRef, comentario) {
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
        this.http.put<any>(environment.urlServices + 'fr001/xxmab_item_loc_traits/', body, { headers })
            .subscribe(data => {
                this.respuestaSave = data.response
                this.showSpinnerSave = false;
                this.actualizarButtom = false;
            });
    }
}