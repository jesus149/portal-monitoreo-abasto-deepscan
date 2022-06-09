import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { environment } from 'environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  paramsObject: any;
  appId: any;
  encrypt: any;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit(): void {

    console.log("AppComponent");

    this.route.queryParamMap
      .subscribe((params) => {
        this.paramsObject = { ...params.keys, ...params };

        console.log("paramsObject: ", this.paramsObject);
        console.log("appId: ", this.paramsObject.params.appId);
        console.log("encrypt: ", this.paramsObject.params.encrypt);

        this.appId = this.paramsObject.params.appId;
        this.encrypt = this.paramsObject.params.encrypt;

        this.http.get<any>(environment.urlLogin + 'appId=' + this.appId + '&encrypt=' + this.encrypt + '').subscribe(response => {
          console.log(response);
        }, err => {
          console.log("Error: ", err);
        });
      }
      );
  }

}
