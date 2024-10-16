import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PlanificacionMantencionesComponent } from './planificacion-mantenciones.component';

describe('PlanificacionMantencionesComponent', () => {
  let component: PlanificacionMantencionesComponent;
  let fixture: ComponentFixture<PlanificacionMantencionesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanificacionMantencionesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PlanificacionMantencionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
