import { TestBed } from '@angular/core/testing';

import { SqlOrditiService } from './sql-orditi.service';

describe('SqlOrditiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SqlOrditiService = TestBed.get(SqlOrditiService);
    expect(service).toBeTruthy();
  });
});
