import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarAmbulantePage } from './editar-ambulante.page';

describe('EditarAmbulantePage', () => {
  let component: EditarAmbulantePage;
  let fixture: ComponentFixture<EditarAmbulantePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarAmbulantePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarAmbulantePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
