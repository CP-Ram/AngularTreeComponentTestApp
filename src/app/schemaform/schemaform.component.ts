import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  AbstractControl,
  Validators,
  FormArray
} from "@angular/forms";
import {
  startWith,
  pairwise,
  tap,
  map,
  filter,
  distinctUntilChanged,
  debounceTime,
  takeUntil
} from "rxjs/operators";
import { combineLatest, Subject, of } from "rxjs";
import { AppService } from '../app-service/app.service';


@Component({
  selector: 'app-schemaform',
  templateUrl: './schemaform.component.html',
  styleUrls: ['./schemaform.component.scss']
})
export class SchemaformComponent implements OnInit {

  name = "Angular";
  isFormInitialized = false;
  myForm: FormGroup;
  AuditUnsubscribe: Subject<any> = new Subject();
  public unsubscribe: Subject<any> = new Subject();
  groupName = "lists";
  property = "name";
  initialze = false;
  
  constructor(private formBuilder: FormBuilder,public appService:AppService) {
    this.appService.formschemaInitialization.pipe().subscribe(res=>{
      //for same not using response but actual app result from backend
      this.generateForm();
    })
  }

  generateForm(){
    
    let controlarray1 = this.formBuilder.array([]);
    this.myForm.addControl(this.groupName, controlarray1);
    let groupControl = this.formBuilder.control(null);

    const control = this.myForm.controls[this.groupName] as FormArray;
    this.myForm.setControl(this.groupName, control);
    var listControl = this.formBuilder.group({});
    var ctr = this.formBuilder.control(null);
    listControl.addControl("name", ctr);
    control.push(listControl);

    this.subsubscribeToFormControlValueChanges(listControl, ctr, "name");
    this.initialze = true;
  }

  ngOnInit() {
    this.myForm = this.formBuilder.group({});
  }

  ngAfterViewInit() {
   
  }

  subsubscribeToFormControlValueChanges(
    group: FormGroup,
    fctrl: FormControl,
    propertyName
  ) {
    if (fctrl) {
      fctrl.valueChanges
        .pipe(
          startWith(null),
          pairwise()
        )
        .pipe(distinctUntilChanged())
        .subscribe(([prev, next]: [any, any]) => {
          // var configId = group.get("name");
          console.log("Hi");
        });
    }
  }

}
