import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaformComponent } from './schemaform.component';

describe('SchemaformComponent', () => {
  let component: SchemaformComponent;
  let fixture: ComponentFixture<SchemaformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemaformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
