import { TestBed } from '@angular/core/testing';

import { SecurityService } from './security.service';
import { Store } from '@ngrx/store'; // Importa Store

describe('SecurityService', () => {
  let service: SecurityService;

  beforeEach(() => {

    const storeSpy = jasmine.createSpyObj('Store', ['select', 'dispatch']); // Mock Store

    TestBed.configureTestingModule({
      providers: [
        { provide: Store, useValue: storeSpy },
      ]
    });
    service = TestBed.inject(SecurityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
