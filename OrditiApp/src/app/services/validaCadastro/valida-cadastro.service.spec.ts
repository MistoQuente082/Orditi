import { TestBed } from '@angular/core/testing';

import { ValidaCadastroService } from './valida-cadastro.service';

describe('ValidaCadastroService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ValidaCadastroService = TestBed.get(ValidaCadastroService);
    expect(service).toBeTruthy();
  });
});
