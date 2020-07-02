import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import {AppService} from './app-service/app.service'
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';

import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angulartreeapp';
  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer,public appService:AppService) {
    // matIconRegistry.addSvgIcon(
    //   'angular',
    //   domSanitizer.bypassSecurityTrustResourceUrl('https://0t2.github.io/angular-material-notes/svg/angular.svg'))
    //   .addSvgIconInNamespace(
    //   'custom-svg',
    //   'angular',
    //   domSanitizer.bypassSecurityTrustResourceUrl('https://0t2.github.io/angular-material-notes/svg/angular_solidBlack.svg'))
    //   .addSvgIconSetInNamespace('core',
    //   domSanitizer.bypassSecurityTrustResourceUrl('https://0t2.github.io/angular-material-notes/svg/core-icon-set.svg'))
    //   .registerFontClassAlias('fontawesome', 'fa');
    var icons = GlobalIcons
    for (let element in icons) {
      this.matIconRegistry.addSvgIcon(
        element,
        this.domSanitizer.bypassSecurityTrustResourceUrl(icons[element]));
    }
  }

  activateNode=false;
  ActiveNode(){
    let formsBackendRecievedSampleList=["1","2","3","4","5","6","7","8","9","10"];
    let start=10;
 
    Observable
    .interval(100)
    .map(x => x + 1) // to start from 1 instead of 0
    .take(10)
    .subscribe((res)=>{
      console.log(res)
      if(!this.activateNode){
        let treeMsg = {
          Type:"ActivateNode",
          treePayload:"ac1c57df-1058-4928-81e6-62b7c9b0aa0c"
        }
        this.appService.sendMessageToTreeComponent.next(treeMsg);
        this.activateNode=true;
      }
      this.appService.formschemaInitialization.next("backendResult");
    });

    // formsBackendRecievedSampleList.forEach(item=>{
      if(!this.activateNode){
        let treeMsg = {
          Type:"ActivateNode",
          treePayload:"ac1c57df-1058-4928-81e6-62b7c9b0aa0c"
        }
        this.appService.sendMessageToTreeComponent.next(treeMsg);
        this.activateNode=true;
      }
      this.appService.formschemaInitialization.next("backendResult");
    // })

  }
}

export const GlobalIcons = {
  MeterStationTreeIcon: "wwwroot/images/All FDC Icons 47x47 24.05.2018/Meter_Station_Solid_white.svg",
  "ExpandAccordion": "wwwroot/images/V3 Icon set part1/ExpandAccordion.svg"
}
