import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppService {
    public sendMessageToTreeComponent =new Subject();
    public formschemaInitialization = new Subject();
    constructor(){
    }
}