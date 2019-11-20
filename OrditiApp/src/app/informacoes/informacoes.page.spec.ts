import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacoesPage } from './informacoes.page';

describe('InformacoesPage', () => {
  let component: InformacoesPage;
  let fixture: ComponentFixture<InformacoesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformacoesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformacoesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
