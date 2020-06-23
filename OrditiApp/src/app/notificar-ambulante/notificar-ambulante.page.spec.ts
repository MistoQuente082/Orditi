import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificarAmbulantePage } from './notificar-ambulante.page';

describe('NotificarAmbulantePage', () => {
  let component: NotificarAmbulantePage;
  let fixture: ComponentFixture<NotificarAmbulantePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificarAmbulantePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificarAmbulantePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
