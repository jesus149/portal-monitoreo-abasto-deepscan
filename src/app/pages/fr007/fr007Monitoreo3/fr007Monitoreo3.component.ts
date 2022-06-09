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
import { Fr007Monitoreo3Model } from '../../../models/Fr007Monitoreo3Model.model'
import { MatRadioChange } from '@angular/material/radio';


import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx';

@Component({
    selector: 'fr007Monitoreo3-cmp',
    templateUrl: 'fr007Monitoreo3.component.html',
    styleUrls: ['fr007Monitoreo3.component.css']
})

export class Fr007Monitoreo3 implements OnInit {

    fechaExcel = this.datepipe.transform(new Date(), 'dd-MM-yyyy');

    displayedColumnsFRSC: string[] = ['item', 'location', 'supplier', 'creation_date', 'id_ref',  'last_update_date', 'last_updated_by', 'comentarios', 'estatus'];
    headFRSC = [['item', 'location', 'supplier', 'creation_date', 'id_ref',  'last_update_date', 'last_updated_by', 'comentarios', 'estatus']];

    headILExcel = [['XXMAB_FEMSA_REPL_SIV_FR007', '', '', '', '', '', '', 'Fecha creación: ' + this.fechaExcel.toString(), ''],
    ['item', 'location', 'supplier', 'creation_date', 'id_ref', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus']]

    @ViewChild('PaginatorFRSC', { static: true }) paginatorFRSC: MatPaginator;
    @ViewChild('SortFRSC', { static: true }) sortFRSC: MatSort
    dataResponseFRSC = null;
    dataResponseTableFRSC = null;
    alertSuccessFRSC = false;
    alertWarningFRSC = false;
    showComponentsFRSC = false;
    alertElementsFRSC = false;
    numElementsFRSC: any;
    showSpinnerFRSC = false;
    hideButtonMostarFRSC = true;
    responseFRSC: any;
    reportPdfFRSC = false;
    reportExcelFRSC = false;

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

        this.dataResponseTableFRSC = [];
        this.numElementsFRSC = [];
        this.dataResponseFRSC = [];
        this.hideButtonMostarFRSC = true;
        this.showComponentsFRSC = false;
        this.alertElementsFRSC = false;
        this.alertSuccessFRSC = false;
        this.alertWarningFRSC = false;

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
                url = environment.urlServices + 'fr007/xxmab_femsa_repl_siv_fr007/?fechaInicio=' + fInicio + '&fechaFin=' + fFinal + '&idRef=' + this.idReferencia + '&estatusReg=' + estatusBusuqeda;
            } else {
                url = environment.urlServices + 'fr007/xxmab_femsa_repl_siv_fr007/?fechaInicio=' + fInicio + '&fechaFin=' + fFinal + '&idRef=' + '&estatusReg=' + estatusBusuqeda;
            }

            this.showSpinnerFRSC = true;

            this.http.get<any>(url).subscribe(response => {
                console.log(response);
                if (response['count'] > 0) {
                    this.responseFRSC = response;
                    this.dataResponseTableFRSC = response['items'];
                    this.numElementsFRSC = response['count'];
                    this.alertElementsFRSC = true;
                } else {
                    this.alertSuccessFRSC = true;
                }
                this.showSpinnerFRSC = false;
            }, err => {
                this.alertWarningFRSC = true;
                this.showSpinnerFRSC = false;
            });
        }

    }

    showTableFRSC() {
        this.dataResponseFRSC = new MatTableDataSource<Fr007Monitoreo3Model>(this.responseFRSC['items'])
        this.dataResponseFRSC.paginator = this.paginatorFRSC;
        this.dataResponseFRSC.sort = this.sortFRSC;
        this.showComponentsFRSC = true;
        this.hideButtonMostarFRSC = false;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataResponseFRSC.filter = filterValue.trim().toLowerCase();
        console.log(this.dataResponseFRSC)
    }

    createPdfFRSC() {

        var rows = [];

        this.dataResponseTableFRSC.forEach(element => {
            var temp = [element.item, element.location, element.supplier, element.creation_date?.substr(0, 10), element.id_ref, element.last_update_date, element.last_updated_by, element.comentarios, element.estatus];
            rows.push(temp);
        })

        var doc1 = new jsPDF({ orientation: "landscape" });

        doc1.setFontSize(18);
        doc1.text('Flujo de información de Ligas Reple R2 de PIEVE a DAS.', 11, 8);
        doc1.setFontSize(11);
        doc1.setTextColor(100);

        let fecha = this.datepipe.transform(new Date(), 'dd-MM-yyyy');

        doc1.text('Fecha creación: ' + fecha.toString(), 240, 8);

        (doc1 as any).autoTable({
            head: this.headFRSC,
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
        doc1.save('fr001Monitoreo3.pdf');
    }

    exportExcelFRSC() {

        var rows = [];

        this.dataResponseTableFRSC.forEach(element => {
            var temp = [element.item, element.location, element.supplier, element.creation_date?.substr(0, 10), element.id_ref, element.last_update_date, element.last_updated_by, element.comentarios, element.estatus];
            rows.push(temp);
        })

        var header = this.headILExcel;

        var wb = XLSX.utils.book_new();
        var ws = XLSX.utils.json_to_sheet(rows);
        XLSX.utils.sheet_add_aoa(ws, header);
        XLSX.utils.book_append_sheet(wb, ws, "fr001Monitoreo3.xlsx");
        XLSX.writeFile(wb, "fr001Monitoreo3.xlsx");

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

    radioChangeReportFRSC(event: MatRadioChange) {
        if (event.value == 'pdf') {
            this.reportExcelFRSC = false
            this.reportPdfFRSC = true
        } else if (event.value == 'excel') {
            this.reportPdfFRSC = false
            this.reportExcelFRSC = true
        }
    }


    updateEstatusFRSC() {
        let fInicio = this.datepipe.transform(this.fechaInicio, 'yyyy-MM-dd');
        let fFinal = this.datepipe.transform(this.fechaFin, 'yyyy-MM-dd');
        this.dialog.open(DialogConfirmFRSC, {
            data: { fechaInicial: fInicio, fechaFinal: fFinal }
        });
    }


}

@Component({
    selector: 'dialog-confirmFRSC',
    templateUrl: 'dialog-confirmFRSC.html',
    styleUrls: ['fr007Monitoreo3.component.css']
})
export class DialogConfirmFRSC {
    constructor(
        public dialogRef: MatDialogRef<DialogConfirmFRSC>,
        @Inject(MAT_DIALOG_DATA) public dataFechas: any,
        private http: HttpClient,
    ) { }

    respuestaSave: any;
    showSpinnerSave = false;
    actualizarButtom = true;

    onNoClick(): void {
        this.dialogRef.close();
    }

    updateEstatusFRSC(idRef, comentario) {
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
        this.http.put<any>(environment.urlServices + 'fr007/xxmab_femsa_repl_siv_fr007/', body, { headers })
            .subscribe(data => {
                this.respuestaSave = data.response
                this.showSpinnerSave = false;
                this.actualizarButtom = false;
            });
    }
}