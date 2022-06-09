import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common'
import { MatAccordion } from '@angular/material/expansion';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'environments/environment';

@Component({
    selector: 'consultasDM-cmp',
    moduleId: module.id,
    templateUrl: 'consultasDM.component.html',
    styleUrls: ['./consultasDM.component.css']
})

export class ConsultasDM implements OnInit {

    @ViewChild(MatAccordion) accordion: MatAccordion;
    appId: any;
    encrypt: any;

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

    openDialogfr01() {
        this.dialog.open(Dialogfr001);
    }

    openDialogfr05() {
        this.dialog.open(Dialogfr005);
    }

    openDialogfr07() {
        this.dialog.open(Dialogfr007);
    }

    openDialogfr08() {
        this.dialog.open(Dialogfr008);
    }
}


@Component({
    selector: 'dialog-fr001',
    templateUrl: 'dialog-fr001.html',
    styleUrls: ['./consultasDM.component.css']
})
export class Dialogfr001 {

    constructor(
        public dialogRef: MatDialogRef<Dialogfr001>,
        private router: Router
    ) {
    }

    navegar(url) {
        this.router.navigateByUrl('/' + url);
        this.dialogRef.close();
    }
}


@Component({
    selector: 'dialog-fr005',
    templateUrl: 'dialog-fr005.html',
    styleUrls: ['./consultasDM.component.css']
})
export class Dialogfr005 {

    constructor(
        public dialogRef: MatDialogRef<Dialogfr005>,
        private router: Router
    ) {
    }

    navegar(url) {
        this.router.navigateByUrl('/' + url);
        this.dialogRef.close();
    }
}

@Component({
    selector: 'dialog-fr007',
    templateUrl: 'dialog-fr007.html',
    styleUrls: ['./consultasDM.component.css']
})
export class Dialogfr007 {

    constructor(
        public dialogRef: MatDialogRef<Dialogfr007>,
        private router: Router
    ) {
    }

    navegar(url) {
        this.router.navigateByUrl('/' + url);
        this.dialogRef.close();
    }
}

@Component({
    selector: 'dialog-fr008',
    templateUrl: 'dialog-fr008.html',
    styleUrls: ['./consultasDM.component.css']
})
export class Dialogfr008 {

    constructor(
        public dialogRef: MatDialogRef<Dialogfr008>,
        private router: Router
    ) {
    }

    navegar(url) {
        this.router.navigateByUrl('/' + url);
        this.dialogRef.close();
    }
}