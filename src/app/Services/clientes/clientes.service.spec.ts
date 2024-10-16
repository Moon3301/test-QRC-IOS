import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store'; 
import { ClientesService } from './clientes.service';
import { of } from 'rxjs';
import { ClientesComponent } from 'src/app/Components/clientes/clientes.component';

describe('ClientesService', () => {
  let service: ClientesService;


  beforeEach(() => {
    const storeSpy = jasmine.createSpyObj('Store', ['select', 'dispatch']); // Mock Store
    TestBed.configureTestingModule({
      providers: [
        { provide: Store, useValue: storeSpy },
      ]
    });
    service = TestBed.inject(ClientesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
