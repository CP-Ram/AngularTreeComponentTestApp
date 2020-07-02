import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularHierarchyTreeComponent } from './angular-hierarchy-tree/angular-hierarchy-tree.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedMaterialModule } from './shared-material/shared-material.module';
import { TreeModule } from 'angular-tree-component';
import { CommonMappingPipe } from './common-mapping.pipe';
import { HttpClientModule } from '@angular/common/http';
import { SchemaformComponent } from './schemaform/schemaform.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    CommonMappingPipe,
    AngularHierarchyTreeComponent,
    SchemaformComponent
  ],
  imports: [
    FormsModule, ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedMaterialModule,
    HttpClientModule,
    TreeModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
