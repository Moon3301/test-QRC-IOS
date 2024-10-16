import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TestEquipoComponent } from './test-equipo.component';

describe('TestEquipoComponent', () => {
  let component: TestEquipoComponent;
  let fixture: ComponentFixture<TestEquipoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [  ],
      imports: [IonicModule.forRoot(), TestEquipoComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestEquipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
