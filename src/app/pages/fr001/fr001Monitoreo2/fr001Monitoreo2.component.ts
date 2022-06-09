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
import { Fr001Monitoreo2Model } from '../../../models/fr001Monitoreo2.model'
import { MatRadioChange } from '@angular/material/radio';


import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx';

@Component({
    selector: 'fr001Monitoreo2-cmp',
    templateUrl: 'fr001Monitoreo2.component.html',
    styleUrls: ['fr001Monitoreo2.component.css']
})

export class Fr001Monitoreo2 implements OnInit {

    fechaExcel = this.datepipe.transform(new Date(), 'dd-MM-yyyy');

    displayedColumnsRD: string[] = ['item', 'location', 'weekday', 'creation_date', 'id_ref', 'seccion', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus'];
    headRD = [['item', 'location', 'weekday', 'creation_date', 'id_ref', 'seccion', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus']];

    headRDExcel = [['xxmab_repl_item_loc_fr001, 1.1, 1.2', '', '', '', '', '', '', '', 'Fecha creación: ' + this.fechaExcel.toString(), ''],
    ['item', 'location', 'weekday', 'creation_date', 'id_ref', 'seccion', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus']]

    @ViewChild('PaginatorRD', { static: true }) paginatorRD: MatPaginator;
    @ViewChild('SortRD', { static: true }) sortRD: MatSort
    dataResponseRD = null;
    dataResponseTableRD = null;
    alertSuccessRD = false;
    alertWarningRD = false;
    showComponentsRD = false;
    alertElementsRD = false;
    numElementsRD: any;
    showSpinnerRD = false;
    hideButtonMostarRD = true;
    responseRD: any;
    reportPdfRD = false;
    reportExcelRD = false;

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

        this.dataResponseTableRD = [];
        this.numElementsRD = [];
        this.dataResponseRD = [];
        this.hideButtonMostarRD = true;
        this.showComponentsRD = false;
        this.alertElementsRD = false;
        this.alertSuccessRD = false;
        this.alertWarningRD = false;

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

            this.rangoFechas = ""

            var url = '';

            if (this.idReferencia != undefined) {
                url = environment.urlServices + 'fr001/xxmab_repl_day/?fechaInicio=' + fInicio + '&fechaFin=' + fFinal + '&idRef=' + this.idReferencia + '&estatusReg=' + estatusBusuqeda;
            } else {
                url = environment.urlServices + 'fr001/xxmab_repl_day/?fechaInicio=' + fInicio + '&fechaFin=' + fFinal + '&idRef=' + '&estatusReg=' + estatusBusuqeda;
            }

            this.showSpinnerRD = true;

            this.http.get<any>(url).subscribe(response => {
                console.log(response);
                if (response['count'] > 0) {
                    this.responseRD = response;
                    this.dataResponseTableRD = response['items'];
                    this.numElementsRD = response['count'];
                    this.alertElementsRD = true;
                } else {
                    this.alertSuccessRD = true;
                }
                this.showSpinnerRD = false;
            }, err => {
                this.alertWarningRD = true;
                this.showSpinnerRD = false;
            });
        }

    }

    showTableRD() {
        this.dataResponseRD = new MatTableDataSource<Fr001Monitoreo2Model>(this.responseRD['items'])
        this.dataResponseRD.paginator = this.paginatorRD;
        this.dataResponseRD.sort = this.sortRD;
        this.showComponentsRD = true;
        this.hideButtonMostarRD = false;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataResponseRD.filter = filterValue.trim().toLowerCase();
        console.log(this.dataResponseRD)
    }

    createPdfRD() {

        this.spinner.show();

        var promise = new Promise((resolve, reject) => {
            var rows = [];

            this.dataResponseTableRD.forEach(element => {
                var temp = [element.item, element.location, element.weekday, element.creation_date?.substr(0, 10), element.id_ref, element.seccion, element.last_update_date, element.last_updated_by, element.comentarios, element.estatus];
                rows.push(temp);
            })

            var doc1 = new jsPDF({ orientation: "landscape" });

            doc1.setFontSize(18);
            doc1.text('Monitorear el borrado de ligas de replenishment y días de generación de pedidos en RMS v10 que se inactivaron en RMS v16.', 11, 8);
            doc1.setFontSize(11);
            doc1.setTextColor(100);

            let fecha = this.datepipe.transform(new Date(), 'dd-MM-yyyy');

            doc1.text('Fecha creación: ' + fecha.toString(), 240, 8);

            (doc1 as any).autoTable({
                head: this.headRD,
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
            doc1.save('fr001Modulo2.pdf');

            resolve('xlsx download');

        })

        promise.then((success) => {
            console.log("success")
            this.spinner.hide();
        })
            .catch((error) => {
                console.log("error")
                this.spinner.hide();
            });


    }

    exportExcelRD() {

        this.spinner.show();


        var promise = new Promise((resolve, reject) => {
            var rows = [];

            this.dataResponseTableRD.forEach(element => {
                var temp = [element.item, element.location, element.weekday, element.creation_date?.substr(0, 10), element.id_ref, element.seccion, element.last_update_date, element.last_updated_by, element.comentarios, element.estatus];
                rows.push(temp);
            })

            var header = this.headRDExcel;

            var wb = XLSX.utils.book_new();
            var ws = XLSX.utils.json_to_sheet(rows);
            XLSX.utils.sheet_add_aoa(ws, header);
            XLSX.utils.book_append_sheet(wb, ws, "fr001Modulo2.xlsx");
            XLSX.writeFile(wb, "fr001Modulo2.xlsx");

            resolve('xlsx download');

        })

        promise.then((success) => {
            console.log("success")
            this.spinner.hide();
        })
            .catch((error) => {
                console.log("error")
                this.spinner.hide();
            });
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

    radioChangeReportRD(event: MatRadioChange) {
        if (event.value == 'pdf') {
            this.reportExcelRD = false
            this.reportPdfRD = true
        } else if (event.value == 'excel') {
            this.reportPdfRD = false
            this.reportExcelRD = true
        }
    }


    updateEstatusRD() {
        let fInicio = this.datepipe.transform(this.fechaInicio, 'yyyy-MM-dd');
        let fFinal = this.datepipe.transform(this.fechaFin, 'yyyy-MM-dd');
        this.dialog.open(DialogConfirmRD, {
            data: { fechaInicial: fInicio, fechaFinal: fFinal }
        });
    }


}

@Component({
    selector: 'dialog-confirmRD',
    templateUrl: 'dialog-confirmRD.html',
    styleUrls: ['fr001Monitoreo2.component.css']
})
export class DialogConfirmRD {
    constructor(
        public dialogRef: MatDialogRef<DialogConfirmRD>,
        @Inject(MAT_DIALOG_DATA) public dataFechas: any,
        private http: HttpClient,
    ) { }

    respuestaSave: any;
    showSpinnerSave = false;
    actualizarButtom = true;

    onNoClick(): void {
        this.dialogRef.close();
    }

    updateEstatusRD(idRef, comentario) {
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
        this.http.put<any>(environment.urlServices + 'fr001/xxmab_repl_day/', body, { headers })
            .subscribe(data => {
                this.respuestaSave = data.response
                this.showSpinnerSave = false;
                this.actualizarButtom = false;
            });
    }
}