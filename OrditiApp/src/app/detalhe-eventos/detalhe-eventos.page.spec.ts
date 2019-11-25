import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalheEventosPage } from './detalhe-eventos.page';

describe('DetalheEventosPage', () => {
  let component: DetalheEventosPage;
  let fixture: ComponentFixture<DetalheEventosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalheEventosPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalheEventosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
