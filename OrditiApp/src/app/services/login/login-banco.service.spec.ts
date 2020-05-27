import { TestBed } from '@angular/core/testing';

import { LoginBancoService } from './login-banco.service';

describe('LoginBancoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoginBancoService = TestBed.get(LoginBancoService);
    expect(service).toBeTruthy();
  });
});
