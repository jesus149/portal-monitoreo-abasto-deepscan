import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NgxSpinnerModule } from "ngx-spinner";

import { AdminLayoutRoutes } from './admin-layout.routing';

import { ConsultasDM } from '../../pages/consultasDM/consultasDM.component';
import { ConsultasF2 } from '../../pages/consultasF2/consultasF2.component';
import { AdminUsuarios } from '../../pages/adminUsuarios/adminUsuarios.component';
import { Salir } from '../../pages/salir/salir.component';



import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//angular material

import { MaterialModule } from 'app/material-module';

//Modulos fr
import { Fr001Monitoreo1 } from '../../pages/fr001/fr001Monitoreo1/fr001Monitoreo1.component';
import { Fr001Monitoreo2 } from '../../pages/fr001/fr001Monitoreo2/fr001Monitoreo2.component';
import { Fr001Monitoreo3 } from '../../pages/fr001/fr001Monitoreo3/fr001Monitoreo3.component';
import { Fr001Monitoreo4 } from '../../pages/fr001/fr001Monitoreo4/fr001Monitoreo4.component';
import { Fr003 } from '../../pages/fr003/fr003.component'
import { Fr004 } from '../../pages/fr004/fr004.component'
import { Fr005Monitoreo1 } from '../../pages/fr005/fr005Monitoreo1/fr005Monitoreo1.component';
import { Fr005Monitoreo2 } from '../../pages/fr005/fr005Monitoreo2/fr005Monitoreo2.component';

import { Fr007Monitoreo1 } from '../../pages/fr007/fr007Monitoreo1/fr007Monitoreo1.component';
import { Fr007Monitoreo2 } from '../../pages/fr007/fr007Monitoreo2/fr007Monitoreo2.component';
import { Fr007Monitoreo3 } from '../../pages/fr007/fr007Monitoreo3/fr007Monitoreo3.component';
import { Fr007Monitoreo4 } from '../../pages/fr007/fr007Monitoreo4/fr007Monitoreo4.component';
import { Fr008Monitoreo1 } from '../../pages/fr008/fr008Monitoreo1/fr008Monitoreo1.component';
import { Fr008Monitoreo2 } from '../../pages/fr008/fr008Monitoreo2/fr008Monitoreo2.component';

//Dialog
import { DialogConfirmRIL1 } from '../../pages/fr001/fr001Monitoreo1/fr001Monitoreo1.component';
import { DialogConfirmRIL2 } from '../../pages/fr001/fr001Monitoreo1/fr001Monitoreo1.component';
import { DialogConfirmRIL3 } from '../../pages/fr001/fr001Monitoreo1/fr001Monitoreo1.component';
import { DialogConfirmRIL4 } from '../../pages/fr001/fr001Monitoreo1/fr001Monitoreo1.component';
import { DialogConfirmRIL5 } from '../../pages/fr001/fr001Monitoreo1/fr001Monitoreo1.component';
import { DialogConfirmRD } from '../../pages/fr001/fr001Monitoreo2/fr001Monitoreo2.component';
import { DialogConfirmILT } from '../../pages/fr001/fr001Monitoreo3/fr001Monitoreo3.component';
import { DialogConfirmIT1 } from '../../pages/fr001/fr001Monitoreo4/fr001Monitoreo4.component';
import { DialogConfirmIT2 } from '../../pages/fr001/fr001Monitoreo4/fr001Monitoreo4.component';
import { DialogConfirmFRLS } from '../../pages/fr003/fr003.component';
import { DialogConfirmXAC } from '../../pages/fr004/fr004.component'
import { DialogConfirmISC1 } from '../../pages/fr005/fr005Monitoreo1/fr005Monitoreo1.component';
import { DialogConfirmISC2 } from '../../pages/fr005/fr005Monitoreo1/fr005Monitoreo1.component';
import { DialogConfirmIS1 } from '../../pages/fr005/fr005Monitoreo2/fr005Monitoreo2.component';
import { DialogConfirmIS2 } from '../../pages/fr005/fr005Monitoreo2/fr005Monitoreo2.component';

import { DialogConfirmFRS } from '../../pages/fr007/fr007Monitoreo1/fr007Monitoreo1.component';
import { DialogConfirmRIL } from '../../pages/fr007/fr007Monitoreo2/fr007Monitoreo2.component';
import { DialogConfirmFRSC } from '../../pages/fr007/fr007Monitoreo3/fr007Monitoreo3.component';
import { DialogConfirmIT } from '../../pages/fr007/fr007Monitoreo4/fr007Monitoreo4.component';

import { DialogConfirmFRSFR008 } from '../../pages/fr008/fr008Monitoreo1/fr008Monitoreo1.component';
import { DialogConfirmRILFR008 } from '../../pages/fr008/fr008Monitoreo2/fr008Monitoreo2.component';

import { Dialogfr001 } from '../../pages/consultasDM/consultasDM.component';
import { Dialogfr005 } from '../../pages/consultasDM/consultasDM.component';
import { Dialogfr007 } from '../../pages/consultasDM/consultasDM.component';
import { Dialogfr008 } from '../../pages/consultasDM/consultasDM.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    NgbModule,
    MaterialModule,
    NgxSpinnerModule
  ],
  declarations: [
    ConsultasDM,
    Dialogfr001,
    Dialogfr005,
    Dialogfr007,
    Dialogfr008,
    ConsultasF2,
    AdminUsuarios,
    Salir,
    Fr001Monitoreo1,
    DialogConfirmRIL1,
    DialogConfirmRIL2,
    DialogConfirmRIL3,
    DialogConfirmRIL4,
    DialogConfirmRIL5,
    Fr001Monitoreo2,
    DialogConfirmRD,
    Fr001Monitoreo3,
    DialogConfirmILT,
    Fr001Monitoreo4,
    DialogConfirmIT1,
    DialogConfirmIT2,
    Fr003,
    DialogConfirmFRLS,
    Fr004,
    DialogConfirmXAC,
    Fr005Monitoreo1,
    DialogConfirmISC1,
    DialogConfirmISC2,
    Fr005Monitoreo2,
    DialogConfirmIS1,
    DialogConfirmIS2,
    Fr007Monitoreo1,
    DialogConfirmFRS,
    Fr007Monitoreo2,
    DialogConfirmRIL,
    Fr007Monitoreo3,
    DialogConfirmFRSC,
    Fr007Monitoreo4,
    DialogConfirmIT,
    Fr008Monitoreo1,
    DialogConfirmFRSFR008,
    Fr008Monitoreo2,
    DialogConfirmRILFR008
  ],
  providers: [DatePipe]
})

export class AdminLayoutModule { }
