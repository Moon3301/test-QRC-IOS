import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { EquiposComponent } from './equipos.component';
import { Store } from '@ngrx/store';

describe('EquiposComponent', () => {
  let component: EquiposComponent;
  let fixture: ComponentFixture<EquiposComponent>;

  beforeEach(waitForAsync(() => {

    const storeSpy = jasmine.createSpyObj('Store', ['select', 'dispatch']); // Mock del Store

    TestBed.configureTestingModule({
      declarations: [  ],
      imports: [IonicModule.forRoot(), EquiposComponent, BrowserAnimationsModule],
      providers: [
        { provide: Store, useValue: storeSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EquiposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
