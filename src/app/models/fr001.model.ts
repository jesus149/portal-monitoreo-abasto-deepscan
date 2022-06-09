export interface ITipoCambio {
    id?: number;
    baseDatos?: string;
    tabla?: string;
    mensajeError?: string;
    tipoCambio?: string;
    moneda?: string;
    fechaActivacion?: string;
}

export class TipoCambio implements ITipoCambio {
    constructor(public id?: number, public baseDatos?: string, public tabla?: string, public mensajeError?: string, public tipoCambio?: string, public moneda?: string, public fechaActivacion?: string) { }
}
