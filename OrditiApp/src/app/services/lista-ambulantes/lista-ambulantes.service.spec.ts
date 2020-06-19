import { TestBed } from '@angular/core/testing';

import { ListaAmbulantesService } from './lista-ambulantes.service';

describe('ListaAmbulantesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ListaAmbulantesService = TestBed.get(ListaAmbulantesService);
    expect(service).toBeTruthy();
  });
});
