import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'app/../environments/environment';
import { ITipoCambio } from 'app/models/fr001.model'
import { createRequestOption } from 'app/shared/util/request-util';

type EntityResponseType = HttpResponse<ITipoCambio>;
type EntityArrayResponseType = HttpResponse<ITipoCambio[]>;


@Injectable({ providedIn: 'root' })
export class Fr001Service {

    public resourceUrl = environment.urlServices + '/fr001/currency_rates_stg/';

    private _jsonURL = 'assets/fr001.json';

    constructor(protected http: HttpClient) { }

    find(): Observable<ITipoCambio> {
        //return this.http.get<ITipoCambio>(this.resourceUrl, { observe: 'response' });

       // return this.http.get<ITipoCambio>(this.resourceUrl);

       return this.http.get(this._jsonURL)

    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ITipoCambio[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

}