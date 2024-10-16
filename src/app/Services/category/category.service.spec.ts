import { TestBed } from '@angular/core/testing';
import { CategoryService } from './category.service';
import { Store } from '@ngrx/store'; // Importa Store

describe('CategoryService', () => {
  let service: CategoryService;

  beforeEach(() => {

    const storeSpy = jasmine.createSpyObj('Store', ['select', 'dispatch']); // Mock Store

    TestBed.configureTestingModule({
      providers: [
        { provide: Store, useValue: storeSpy },
      ]
    });
    service = TestBed.inject(CategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
