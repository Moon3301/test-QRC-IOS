import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MantencionesComponent } from './mantenciones.component';
import { Store } from '@ngrx/store'; // Importa Store

describe('MantencionesComponent', () => {
  let component: MantencionesComponent;
  let fixture: ComponentFixture<MantencionesComponent>;

  beforeEach(waitForAsync(() => {
    const storeSpy = jasmine.createSpyObj('Store', ['select', 'dispatch']); // Mock Store
    TestBed.configureTestingModule({
      declarations: [  ],
      imports: [IonicModule.forRoot(), MantencionesComponent],
      providers: [
        { provide: Store, useValue: storeSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MantencionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
