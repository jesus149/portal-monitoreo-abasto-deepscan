import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'environments/environment';

import "jspdf-autotable";

@Component({
    selector: "login-cmp",
    styleUrls: ["./login.component.css"],
    templateUrl: "login.component.html",
})
export class Login implements OnInit {
    form: FormGroup;
    public loginInvalid = false;
    private formSubmitAttempt = false;
    private returnUrl: string;

    paramsObject: any;
    appId: any;
    encrypt: any;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private http: HttpClient,
        private router: Router,
        public dialog: MatDialog,
        private spinner: NgxSpinnerService
    ) {
        this.form = this.fb.group({
            username: ['', Validators.email],
            password: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        console.log("login")
        this.spinner.show();
        localStorage.setItem('username', null);
        localStorage.setItem('appId', null);
        localStorage.setItem('encrypt', null);
        this.route.queryParamMap
            .subscribe((params) => {
                this.paramsObject = { ...params.keys, ...params };

                this.appId = this.paramsObject.params.appId;
                this.encrypt = this.paramsObject.params.encrypt;

                localStorage.setItem('appId', this.appId);
                localStorage.setItem('encrypt', this.encrypt);

                this.http.get<any>(environment.urlLogin + 'appId=' + this.appId + '&encrypt=' + this.encrypt + '').subscribe(response => {
                    console.log(response[0].fullName);
                    console.log(response[0].keyId);
                    localStorage.setItem('username', response[0].fullNamet);
                    this.spinner.hide();
                    this.router.navigate(['/consultasDM']);
                }, err => {
                    this.spinner.hide();
                    console.log("Error: ", err);
                    localStorage.clear();
                    const dialogRef = this.dialog.open(DialogContentExampleDialog);
                });
            }
            );
    }



    async onSubmit(): Promise<void> {
        this.loginInvalid = false;
        this.formSubmitAttempt = false;
        if (this.form.valid) {
            try {
                console.log(this.form.get('username')?.value)
                console.log(this.form.get('password')?.value)
                const username = this.form.get('username')?.value;
                const password = this.form.get('password')?.value;
                //await this.authService.login(username, password);
            } catch (err) {
                this.loginInvalid = true;
            }
        } else {
            this.formSubmitAttempt = true;
        }
    }

}

@Component({
    selector: 'dialog-error-login',
    templateUrl: 'dialog-error-login.html',
})
export class DialogContentExampleDialog { }