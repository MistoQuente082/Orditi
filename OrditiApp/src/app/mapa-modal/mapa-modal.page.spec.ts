import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaModalPage } from './mapa-modal.page';

describe('MapaModalPage', () => {
  let component: MapaModalPage;
  let fixture: ComponentFixture<MapaModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapaModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
