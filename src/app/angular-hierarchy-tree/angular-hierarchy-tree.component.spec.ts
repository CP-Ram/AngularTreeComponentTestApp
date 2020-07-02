import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularHierarchyTreeComponent } from './angular-hierarchy-tree.component';

describe('AngularHierarchyTreeComponent', () => {
  let component: AngularHierarchyTreeComponent;
  let fixture: ComponentFixture<AngularHierarchyTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AngularHierarchyTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AngularHierarchyTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
