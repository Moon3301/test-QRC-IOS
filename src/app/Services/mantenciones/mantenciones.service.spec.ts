import { TestBed } from '@angular/core/testing';

import { MantencionesService } from './mantenciones.service';

describe('MantencionesService', () => {
  let service: MantencionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MantencionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
