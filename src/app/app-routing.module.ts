import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AngularHierarchyTreeComponent } from './angular-hierarchy-tree/angular-hierarchy-tree.component';


const routes: Routes = [
  { path: '', component: AngularHierarchyTreeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
