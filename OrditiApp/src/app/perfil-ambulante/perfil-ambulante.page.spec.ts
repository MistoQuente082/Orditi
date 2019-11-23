import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilAmbulantePage } from './perfil-ambulante.page';

describe('PerfilAmbulantePage', () => {
  let component: PerfilAmbulantePage;
  let fixture: ComponentFixture<PerfilAmbulantePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerfilAmbulantePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilAmbulantePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
