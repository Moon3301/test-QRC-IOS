import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InicioComponent } from './inicio.component';
import { Store } from '@ngrx/store'; // Importa Store

describe('InicioComponent', () => {
  let component: InicioComponent;
  let fixture: ComponentFixture<InicioComponent>;

  

  beforeEach(waitForAsync(() => {

    const storeSpy = jasmine.createSpyObj('Store', ['select', 'dispatch']); // Mock Store

    TestBed.configureTestingModule({
      declarations: [  ],
      imports: [IonicModule.forRoot(), InicioComponent],
      providers: [
        { provide: Store, useValue: storeSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
