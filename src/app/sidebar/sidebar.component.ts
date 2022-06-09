import { Component, OnInit } from '@angular/core';


export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    { path: '/consultasDM',                 title: 'Consultas',                         icon:'fa fa-search',      class: '' },
    //{ path: '/adminUsuarios',             title: 'Administración de usuarios',        icon:'fa fa-user',        class: '' },
    { path: '/salir',                       title: 'Salir',                             icon:'fa fa-sign-out',    class: '' }    
];      

export const ROUTESTitle: RouteInfo[] = [       
    { path: '/consultasDM',       title: 'Consultas Monitor Abasto',                                                                                                                icon:'fa fa-search',      class: '' },
    { path: '/consultasF2',       title: 'Consultas F2',                                                                                                                icon:'fa fa-search',      class: '' },
    { path: '/adminUsuarios',     title: 'Administración de usuarios',                                                                                                  icon:'fa fa-user',        class: '' },
    { path: '/salir',             title: 'Salir',                                                                                                                       icon:'fa fa-sign-out',    class: '' },    
    { path: '/fr001Monitoreo1',   title: 'Monitorear la réplica de las ligas replenishment de RMS v16 - RMS v10.',                                                      icon:'fa fa-sign-out',    class: '' }, 
    { path: '/fr001Monitoreo2',   title: 'Monitorear el borrado de ligas de replenishment y días de generación de pedidos en RMS v10 que se inactivaron en RMS v16.',   icon:'fa fa-sign-out',    class: '' },   
    { path: '/fr001Monitoreo3',   title: 'Monitorear el valor del SOM de la liga de cobertura contra el SOM de la liga replenishment.',                                 icon:'fa fa-sign-out',    class: '' }, 
    { path: '/fr001Monitoreo4',   title: 'Monitorear la desactivación/inactivación de liga de cobertura.',                                                              icon:'fa fa-sign-out',    class: '' },     
    { path: '/fr003',             title: 'Información del tiempo entrega de proveedor.',                                                                                icon:'fa fa-sign-out',    class: '' },   
    { path: '/fr004',             title: 'Promociones Abasto.',                                                                                                         icon:'fa fa-sign-out',    class: '' },  
    { path: '/fr005Monitoreo1',   title: 'Replica de informacion de RMS16 a DAS.',                                                                                      icon:'fa fa-sign-out',    class: '' },  
    { path: '/fr005Monitoreo2',   title: 'Replica de informacion de DAS a RMS10.',                                                                                      icon:'fa fa-sign-out',    class: '' },  
    { path: '/login',             title: 'Monitor Nucleo Abasto.',                                                                                      icon:'fa fa-sign-out',    class: '' },    
];


@Component({
    
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
    styleUrls: ["sidebar.component.css"],
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }
}


