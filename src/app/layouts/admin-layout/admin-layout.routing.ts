import { Routes } from '@angular/router';

import { ConsultasDM } from '../../pages/consultasDM/consultasDM.component';
import { ConsultasF2 } from '../../pages/consultasF2/consultasF2.component';
import { AdminUsuarios } from '../../pages/adminUsuarios/adminUsuarios.component';
import { Salir } from '../../pages/salir/salir.component';

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

export const AdminLayoutRoutes: Routes = [
    { path: 'consultasDM', component: ConsultasDM },
    { path: 'consultasF2', component: ConsultasF2 },
    { path: 'adminUsuarios', component: AdminUsuarios },
    { path: 'salir', component: Salir },
    { path: 'fr001Monitoreo1', component: Fr001Monitoreo1 },
    { path: 'fr001Monitoreo2', component: Fr001Monitoreo2 },
    { path: 'fr001Monitoreo3', component: Fr001Monitoreo3 },
    { path: 'fr001Monitoreo4', component: Fr001Monitoreo4 },
    { path: 'fr003', component: Fr003 },
    { path: 'fr004', component: Fr004 },
    { path: 'fr005Monitoreo1', component: Fr005Monitoreo1 },
    { path: 'fr005Monitoreo2', component: Fr005Monitoreo2 },

    { path: 'fr007Monitoreo1', component: Fr007Monitoreo1 },
    { path: 'fr007Monitoreo2', component: Fr007Monitoreo2 },
    { path: 'fr007Monitoreo3', component: Fr007Monitoreo3 },
    { path: 'fr007Monitoreo4', component: Fr007Monitoreo4 },
    { path: 'fr008Monitoreo1', component: Fr008Monitoreo1 },
    { path: 'fr008Monitoreo2', component: Fr008Monitoreo2 }
];
