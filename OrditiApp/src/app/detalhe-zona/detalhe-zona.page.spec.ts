import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalheZonaPage } from './detalhe-zona.page';

describe('DetalheZonaPage', () => {
  let component: DetalheZonaPage;
  let fixture: ComponentFixture<DetalheZonaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalheZonaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalheZonaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
