import { TestBed } from '@angular/core/testing';

import { EquipmentService } from './equipment.service';
import { Store } from '@ngrx/store'; // Importa Store

describe('EquipmentService', () => {
  let service: EquipmentService;

  beforeEach(() => {
    const storeSpy = jasmine.createSpyObj('Store', ['select', 'dispatch']); // Mock Store

    TestBed.configureTestingModule({
      providers: [
        { provide: Store, useValue: storeSpy },
      ]
    });
    service = TestBed.inject(EquipmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
