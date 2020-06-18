import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroBuscaPage } from './filtro-busca.page';

describe('FiltroBuscaPage', () => {
  let component: FiltroBuscaPage;
  let fixture: ComponentFixture<FiltroBuscaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroBuscaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroBuscaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
