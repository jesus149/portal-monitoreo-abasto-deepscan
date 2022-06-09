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
import { Fr008Monitoreo2Model } from '../../../models/Fr008Monitoreo2Model.model'
import { MatRadioChange } from '@angular/material/radio';


import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx';

@Component({
    selector: 'fr008Monitoreo2-cmp',
    templateUrl: 'fr008Monitoreo2.component.html',
    styleUrls: ['fr008Monitoreo2.component.css']
})

export class Fr008Monitoreo2 implements OnInit {

    fechaExcel = this.datepipe.transform(new Date(), 'dd-MM-yyyy');

    displayedColumnsRIL: string[] = ['item', 'location', 'status', 'last_update_id', 'creation_date', 'id_ref', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus'];
    headRIL = [['item', 'location', 'status', 'last_update_id', 'creation_date', 'id_ref', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus']];

    headILExcel = [['XXMAB_REPL_ITEM_LOC_FR008', '', '', '', '', '', '', 'Fecha creación: ' + this.fechaExcel.toString(), ''],
    ['item', 'location', 'status', 'last_update_id', 'creation_date', 'id_ref', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus']]

    @ViewChild('PaginatorRIL', { static: true }) paginatorRIL: MatPaginator;
    @ViewChild('SortRIL', { static: true }) sortRIL: MatSort
    dataResponseRIL = null;
    dataResponseTableRIL = null;
    alertSuccessRIL = false;
    alertWarningRIL = false;
    showComponentsRIL = false;
    alertElementsRIL = false;
    numElementsRIL: any;
    showSpinnerRIL = false;
    hideButtonMostarRIL = true;
    responseRIL: any;
    reportPdfRIL = false;
    reportExcelRIL = false;

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

        this.dataResponseTableRIL = [];
        this.numElementsRIL = [];
        this.dataResponseRIL = [];
        this.hideButtonMostarRIL = true;
        this.showComponentsRIL = false;
        this.alertElementsRIL = false;
        this.alertSuccessRIL = false;
        this.alertWarningRIL = false;

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
                url = environment.urlServices + 'fr008/xxmab_repl_item_loc_fr008/?fechaInicio=' + fInicio + '&fechaFin=' + fFinal + '&idRef=' + this.idReferencia + '&estatusReg=' + estatusBusuqeda;
            } else {
                url = environment.urlServices + 'fr008/xxmab_repl_item_loc_fr008/?fechaInicio=' + fInicio + '&fechaFin=' + fFinal + '&idRef=' + '&estatusReg=' + estatusBusuqeda;
            }

            this.showSpinnerRIL = true;

            this.http.get<any>(url).subscribe(response => {
                console.log(response);
                if (response['count'] > 0) {
                    this.responseRIL = response;
                    this.dataResponseTableRIL = response['items'];
                    this.numElementsRIL = response['count'];
                    this.alertElementsRIL = true;
                } else {
                    this.alertSuccessRIL = true;
                }
                this.showSpinnerRIL = false;
            }, err => {
                this.alertWarningRIL = true;
                this.showSpinnerRIL = false;
            });
        }

    }

    showTableRIL() {
        this.dataResponseRIL = new MatTableDataSource<Fr008Monitoreo2Model>(this.responseRIL['items'])
        this.dataResponseRIL.paginator = this.paginatorRIL;
        this.dataResponseRIL.sort = this.sortRIL;
        this.showComponentsRIL = true;
        this.hideButtonMostarRIL = false;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataResponseRIL.filter = filterValue.trim().toLowerCase();
        console.log(this.dataResponseRIL)
    }

    createPdfRIL() {

        var rows = [];

        this.dataResponseTableRIL.forEach(element => {
            var temp = [element.item, element.location, element.status, element.last_update_id, element.creation_date?.substr(0, 10), element.id_ref, element.seccion, element.last_update_date, element.last_updated_by, element.comentarios, element.estatus];
            rows.push(temp);
        })

        var doc1 = new jsPDF({ orientation: "landscape" });

        doc1.setFontSize(18);
        doc1.text('Réplica de Recuperación de Ligas DAS a RMS10.', 11, 8);
        doc1.setFontSize(11);
        doc1.setTextColor(100);

        let fecha = this.datepipe.transform(new Date(), 'dd-MM-yyyy');

        doc1.text('Fecha creación: ' + fecha.toString(), 240, 8);

        (doc1 as any).autoTable({
            head: this.headRIL,
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
        doc1.save('fr008Monitoreo2.pdf');
    }

    exportExcelRIL() {

        var rows = [];

        this.dataResponseTableRIL.forEach(element => {
            var temp = [element.item, element.location, element.status, element.last_update_id, element.creation_date?.substr(0, 10), element.id_ref, element.seccion, element.last_update_date, element.last_updated_by, element.comentarios, element.estatus];
            rows.push(temp);
        })

        var header = this.headILExcel;

        var wb = XLSX.utils.book_new();
        var ws = XLSX.utils.json_to_sheet(rows);
        XLSX.utils.sheet_add_aoa(ws, header);
        XLSX.utils.book_append_sheet(wb, ws, "fr008Monitoreo2.xlsx");
        XLSX.writeFile(wb, "fr008Monitoreo2.xlsx");

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

    radioChangeReportRIL(event: MatRadioChange) {
        if (event.value == 'pdf') {
            this.reportExcelRIL = false
            this.reportPdfRIL = true
        } else if (event.value == 'excel') {
            this.reportPdfRIL = false
            this.reportExcelRIL = true
        }
    }


    updateEstatusRIL() {
        let fInicio = this.datepipe.transform(this.fechaInicio, 'yyyy-MM-dd');
        let fFinal = this.datepipe.transform(this.fechaFin, 'yyyy-MM-dd');
        this.dialog.open(DialogConfirmRILFR008, {
            data: { fechaInicial: fInicio, fechaFinal: fFinal }
        });
    }


}

@Component({
    selector: 'dialog-confirmRIL',
    templateUrl: 'dialog-confirmRIL.html',
    styleUrls: ['fr008Monitoreo2.component.css']
})
export class DialogConfirmRILFR008 {
    constructor(
        public dialogRef: MatDialogRef<DialogConfirmRILFR008>,
        @Inject(MAT_DIALOG_DATA) public dataFechas: any,
        private http: HttpClient,
    ) { }

    respuestaSave: any;
    showSpinnerSave = false;
    actualizarButtom = true;

    onNoClick(): void {
        this.dialogRef.close();
    }

    updateEstatusRIL(idRef, comentario) {
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
        this.http.put<any>(environment.urlServices + 'fr008/xxmab_repl_item_loc_fr008/', body, { headers })
            .subscribe(data => {
                this.respuestaSave = data.response
                this.showSpinnerSave = false;
                this.actualizarButtom = false;
            });
    }
}