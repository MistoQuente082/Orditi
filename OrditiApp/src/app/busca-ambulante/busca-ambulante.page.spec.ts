import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscaAmbulantePage } from './busca-ambulante.page';

describe('BuscaAmbulantePage', () => {
  let component: BuscaAmbulantePage;
  let fixture: ComponentFixture<BuscaAmbulantePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscaAmbulantePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscaAmbulantePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
