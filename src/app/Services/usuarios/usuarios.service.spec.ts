import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store'; 
import { UsuariosService } from './usuarios.service';

describe('UsuariosService', () => {
  let service: UsuariosService;

  beforeEach(() => {
    const storeSpy = jasmine.createSpyObj('Store', ['select', 'dispatch']); // Mock Store
    TestBed.configureTestingModule({
      providers: [
        { provide: Store, useValue: storeSpy },
      ]
    });
    service = TestBed.inject(UsuariosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
