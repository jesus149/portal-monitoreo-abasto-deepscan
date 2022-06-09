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
import { Fr007Monitoreo4Model } from '../../../models/Fr007Monitoreo4Model.model'
import { MatRadioChange } from '@angular/material/radio';


import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx';

@Component({
    selector: 'fr007Monitoreo4-cmp',
    templateUrl: 'fr007Monitoreo4.component.html',
    styleUrls: ['fr007Monitoreo4.component.css']
})

export class Fr007Monitoreo4 implements OnInit {

    fechaExcel = this.datepipe.transform(new Date(), 'dd-MM-yyyy');

    displayedColumnsIT: string[] = ['item', 'loc', 'status', 'creation_date', 'id_ref', 'last_update_id', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus'];
    headIT = [['item', 'loc', 'status', 'creation_date', 'id_ref', 'last_update_id', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus']];

    headILExcel = [['XXMAB_ITEM_LOC_FR007', '', '', '', '', '', '', 'Fecha creación: ' + this.fechaExcel.toString(), ''],
    ['item', 'loc', 'status', 'creation_date', 'id_ref', 'last_update_id', 'last_update_date', 'last_updated_by', 'comentarios', 'estatus']]

    @ViewChild('PaginatorIT', { static: true }) paginatorIT: MatPaginator;
    @ViewChild('SortIT', { static: true }) sortIT: MatSort
    dataResponseIT = null;
    dataResponseTableIT = null;
    alertSuccessIT = false;
    alertWarningIT = false;
    showComponentsIT = false;
    alertElementsIT = false;
    numElementsIT: any;
    showSpinnerIT = false;
    hideButtonMostarIT = true;
    responseIT: any;
    reportPdfIT = false;
    reportExcelIT = false;

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

        this.dataResponseTableIT = [];
        this.numElementsIT = [];
        this.dataResponseIT = [];
        this.hideButtonMostarIT = true;
        this.showComponentsIT = false;
        this.alertElementsIT = false;
        this.alertSuccessIT = false;
        this.alertWarningIT = false;

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
                url = environment.urlServices + 'fr007/xxmab_item_loc_fr007/?fechaInicio=' + fInicio + '&fechaFin=' + fFinal + '&idRef=' + this.idReferencia + '&estatusReg=' + estatusBusuqeda;
            } else {
                url = environment.urlServices + 'fr007/xxmab_item_loc_fr007/?fechaInicio=' + fInicio + '&fechaFin=' + fFinal + '&idRef=' + '&estatusReg=' + estatusBusuqeda;
            }

            this.showSpinnerIT = true;

            this.http.get<any>(url).subscribe(response => {
                console.log(response);
                if (response['count'] > 0) {
                    this.responseIT = response;
                    this.dataResponseTableIT = response['items'];
                    this.numElementsIT = response['count'];
                    this.alertElementsIT = true;
                } else {
                    this.alertSuccessIT = true;
                }
                this.showSpinnerIT = false;
            }, err => {
                this.alertWarningIT = true;
                this.showSpinnerIT = false;
            });
        }

    }

    showTableIT() {
        this.dataResponseIT = new MatTableDataSource<Fr007Monitoreo4Model>(this.responseIT['items'])
        this.dataResponseIT.paginator = this.paginatorIT;
        this.dataResponseIT.sort = this.sortIT;
        this.showComponentsIT = true;
        this.hideButtonMostarIT = false;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataResponseIT.filter = filterValue.trim().toLowerCase();
        console.log(this.dataResponseIT)
    }

    createPdfIT() {

        var rows = [];

        this.dataResponseTableIT.forEach(element => {
            var temp = [element.item, element.loc, element.status, element.creation_date?.substr(0, 10), element.id_ref, element.last_update_id, element.last_update_date, element.last_updated_by, element.comentarios, element.estatus];
            rows.push(temp);
        })

        var doc1 = new jsPDF({ orientation: "landscape" });

        doc1.setFontSize(18);
        doc1.text('Replicas de SOM de DAS a RMS10.', 11, 8);
        doc1.setFontSize(11);
        doc1.setTextColor(100);

        let fecha = this.datepipe.transform(new Date(), 'dd-MM-yyyy');

        doc1.text('Fecha creación: ' + fecha.toString(), 240, 8);

        (doc1 as any).autoTable({
            head: this.headIT,
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
        doc1.save('fr001Monitoreo4.pdf');
    }

    exportExcelIT() {

        var rows = [];

        this.dataResponseTableIT.forEach(element => {
            var temp = [element.item, element.loc, element.status, element.creation_date?.substr(0, 10), element.id_ref, element.last_update_id, element.last_update_date, element.last_updated_by, element.comentarios, element.estatus];
            rows.push(temp);
        })

        var header = this.headILExcel;

        var wb = XLSX.utils.book_new();
        var ws = XLSX.utils.json_to_sheet(rows);
        XLSX.utils.sheet_add_aoa(ws, header);
        XLSX.utils.book_append_sheet(wb, ws, "fr001Monitoreo4.xlsx");
        XLSX.writeFile(wb, "fr001Monitoreo4.xlsx");

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

    radioChangeReportIT(event: MatRadioChange) {
        if (event.value == 'pdf') {
            this.reportExcelIT = false
            this.reportPdfIT = true
        } else if (event.value == 'excel') {
            this.reportPdfIT = false
            this.reportExcelIT = true
        }
    }


    updateEstatusIT() {
        let fInicio = this.datepipe.transform(this.fechaInicio, 'yyyy-MM-dd');
        let fFinal = this.datepipe.transform(this.fechaFin, 'yyyy-MM-dd');
        this.dialog.open(DialogConfirmIT, {
            data: { fechaInicial: fInicio, fechaFinal: fFinal }
        });
    }


}

@Component({
    selector: 'dialog-confirmIT',
    templateUrl: 'dialog-confirmIT.html',
    styleUrls: ['fr007Monitoreo4.component.css']
})
export class DialogConfirmIT {
    constructor(
        public dialogRef: MatDialogRef<DialogConfirmIT>,
        @Inject(MAT_DIALOG_DATA) public dataFechas: any,
        private http: HttpClient,
    ) { }

    respuestaSave: any;
    showSpinnerSave = false;
    actualizarButtom = true;

    onNoClick(): void {
        this.dialogRef.close();
    }

    updateEstatusIT(idRef, comentario) {
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
        this.http.put<any>(environment.urlServices + 'fr007/xxmab_item_loc_fr007/', body, { headers })
            .subscribe(data => {
                this.respuestaSave = data.response
                this.showSpinnerSave = false;
                this.actualizarButtom = false;
            });
    }
}