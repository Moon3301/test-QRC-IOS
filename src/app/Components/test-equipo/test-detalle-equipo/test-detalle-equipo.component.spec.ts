import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TestDetalleEquipoComponent } from './test-detalle-equipo.component';

describe('TestDetalleEquipoComponent', () => {
  let component: TestDetalleEquipoComponent;
  let fixture: ComponentFixture<TestDetalleEquipoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [  ],
      imports: [IonicModule.forRoot(), TestDetalleEquipoComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestDetalleEquipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
