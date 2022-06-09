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
import { Fr007Monitoreo1Model } from '../../../models/Fr007Monitoreo1Model.model'
import { MatRadioChange } from '@angular/material/radio';


import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx';

@Component({
    selector: 'fr007Monitoreo1-cmp',
    templateUrl: 'fr007Monitoreo1.component.html',
    styleUrls: ['fr007Monitoreo1.component.css']
})

export class Fr007Monitoreo1 implements OnInit {

    fechaExcel = this.datepipe.transform(new Date(), 'dd-MM-yyyy');

    displayedColumnsFRS: string[] = ['item', 'location', 'som','creation_date', 'id_ref', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus'];
    headFRS = [['item', 'location', 'som', 'creation_date', 'id_ref', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus']];

    headILExcel = [['XXMAB_FEMSA_REPL_SOM_CHANGES_FR007', '',  '', '', '', '', '', 'Fecha creación: ' + this.fechaExcel.toString(), ''],
    ['item', 'location', 'som', 'creation_date', 'id_ref', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus']]

    @ViewChild('PaginatorFRS', { static: true }) paginatorFRS: MatPaginator;
    @ViewChild('SortFRS', { static: true }) sortFRS: MatSort
    dataResponseFRS = null;
    dataResponseTableFRS = null;
    alertSuccessFRS = false;
    alertWarningFRS = false;
    showComponentsFRS = false;
    alertElementsFRS = false;
    numElementsFRS: any;
    showSpinnerFRS = false;
    hideButtonMostarFRS = true;
    responseFRS: any;
    reportPdfFRS = false;
    reportExcelFRS = false;

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

        this.dataResponseTableFRS = [];
        this.numElementsFRS = [];
        this.dataResponseFRS = [];
        this.hideButtonMostarFRS = true;
        this.showComponentsFRS = false;
        this.alertElementsFRS = false;
        this.alertSuccessFRS = false;
        this.alertWarningFRS = false;

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
                url = environment.urlServices + 'fr007/xxmab_femsa_repl_som_changes_fr007/?fechaInicio=' + fInicio + '&fechaFin=' + fFinal + '&idRef=' + this.idReferencia + '&estatusReg=' + estatusBusuqeda;
            } else {
                url = environment.urlServices + 'fr007/xxmab_femsa_repl_som_changes_fr007/?fechaInicio=' + fInicio + '&fechaFin=' + fFinal + '&idRef=' + '&estatusReg=' + estatusBusuqeda;
            }

            this.showSpinnerFRS = true;

            this.http.get<any>(url).subscribe(response => {
                console.log(response);
                if (response['count'] > 0) {
                    this.responseFRS = response;
                    this.dataResponseTableFRS = response['items'];
                    this.numElementsFRS = response['count'];
                    this.alertElementsFRS = true;
                } else {
                    this.alertSuccessFRS = true;
                }
                this.showSpinnerFRS = false;
            }, err => {
                this.alertWarningFRS = true;
                this.showSpinnerFRS = false;
            });
        }

    }

    showTableFRS() {
        this.dataResponseFRS = new MatTableDataSource<Fr007Monitoreo1Model>(this.responseFRS['items'])
        this.dataResponseFRS.paginator = this.paginatorFRS;
        this.dataResponseFRS.sort = this.sortFRS;
        this.showComponentsFRS = true;
        this.hideButtonMostarFRS = false;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataResponseFRS.filter = filterValue.trim().toLowerCase();
        console.log(this.dataResponseFRS)
    }

    createPdfFRS() {

        var rows = [];

        this.dataResponseTableFRS.forEach(element => {
            var temp = [element.item, element.location, element.som, element.creation_date?.substr(0, 10), element.id_ref, element.last_update_date, element.last_updated_by, element.comentarios, element.estatus];
            rows.push(temp);
        })

        var doc1 = new jsPDF({ orientation: "landscape" });

        doc1.setFontSize(18);
        doc1.text('Flujo de información del SOM de PIEVE a DAS.', 11, 8);
        doc1.setFontSize(11);
        doc1.setTextColor(100);

        let fecha = this.datepipe.transform(new Date(), 'dd-MM-yyyy');

        doc1.text('Fecha creación: ' + fecha.toString(), 240, 8);

        (doc1 as any).autoTable({
            head: this.headFRS,
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
        doc1.save('fr007Monitoreo1.pdf');
    }

    exportExcelFRS() {

        var rows = [];

        this.dataResponseTableFRS.forEach(element => {
            var temp = [element.item, element.location, element.som, element.creation_date?.substr(0, 10), element.id_ref, element.last_update_date, element.last_updated_by, element.comentarios, element.estatus];
            rows.push(temp);
        })

        var header = this.headILExcel;

        var wb = XLSX.utils.book_new();
        var ws = XLSX.utils.json_to_sheet(rows);
        XLSX.utils.sheet_add_aoa(ws, header);
        XLSX.utils.book_append_sheet(wb, ws, "fr007Monitoreo1.xlsx");
        XLSX.writeFile(wb, "fr007Monitoreo1.xlsx");

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

    radioChangeReportFRS(event: MatRadioChange) {
        if (event.value == 'pdf') {
            this.reportExcelFRS = false
            this.reportPdfFRS = true
        } else if (event.value == 'excel') {
            this.reportPdfFRS = false
            this.reportExcelFRS = true
        }
    }


    updateEstatusFRS() {
        let fInicio = this.datepipe.transform(this.fechaInicio, 'yyyy-MM-dd');
        let fFinal = this.datepipe.transform(this.fechaFin, 'yyyy-MM-dd');
        this.dialog.open(DialogConfirmFRS, {
            data: { fechaInicial: fInicio, fechaFinal: fFinal }
        });
    }


}

@Component({
    selector: 'dialog-confirmFRS',
    templateUrl: 'dialog-confirmFRS.html',
    styleUrls: ['fr007Monitoreo1.component.css']
})
export class DialogConfirmFRS {
    constructor(
        public dialogRef: MatDialogRef<DialogConfirmFRS>,
        @Inject(MAT_DIALOG_DATA) public dataFechas: any,
        private http: HttpClient,
    ) { }

    respuestaSave: any;
    showSpinnerSave = false;
    actualizarButtom = true;

    onNoClick(): void {
        this.dialogRef.close();
    }

    updateEstatusFRS(idRef, comentario) {
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
        this.http.put<any>(environment.urlServices + 'fr007/xxmab_femsa_repl_som_changes_fr007/', body, { headers })
            .subscribe(data => {
                this.respuestaSave = data.response
                this.showSpinnerSave = false;
                this.actualizarButtom = false;
            });
    }
}