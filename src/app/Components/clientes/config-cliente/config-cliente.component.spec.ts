import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConfigClienteComponent } from './config-cliente.component';

describe('ConfigClienteComponent', () => {
  let component: ConfigClienteComponent;
  let fixture: ComponentFixture<ConfigClienteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [  ],
      imports: [IonicModule.forRoot(), ConfigClienteComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfigClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
