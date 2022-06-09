import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'environments/environment';

@Component({
    selector: 'salir-cmp',
    moduleId: module.id,
    templateUrl: 'salir.component.html'
})

export class Salir implements OnInit{

    constructor(private spinner: NgxSpinnerService
      ) {  }
    
      ngOnInit(): void {

        this.spinner.show();
        localStorage.setItem('username', null);
        localStorage.setItem('appId', null);
        localStorage.setItem('encrypt', null);
        window.location.href = environment.portalAcces;
   
      }

}

