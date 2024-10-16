import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';


import { DetalleUsuarioComponent } from './detalle-usuario.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


describe('DetalleUsuarioComponent', () => {
  let component: DetalleUsuarioComponent;
  let fixture: ComponentFixture<DetalleUsuarioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [  ],
      imports: [IonicModule.forRoot(), DetalleUsuarioComponent],
      providers: [
        // Proveer un mock de MatDialogRef
        { provide: MatDialogRef, useValue: {} },
        // Proveer un mock de MAT_DIALOG_DATA si es necesario
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
