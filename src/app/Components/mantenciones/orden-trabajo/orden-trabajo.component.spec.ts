import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrdenTrabajoComponent } from './orden-trabajo.component';
import { Store } from '@ngrx/store'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('OrdenTrabajoComponent', () => {
  let component: OrdenTrabajoComponent;
  let fixture: ComponentFixture<OrdenTrabajoComponent>;

  beforeEach(waitForAsync(() => {
    const storeSpy = jasmine.createSpyObj('Store', ['select', 'dispatch']); // Mock Store
    TestBed.configureTestingModule({
      declarations: [  ],
      imports: [IonicModule.forRoot(), OrdenTrabajoComponent, BrowserAnimationsModule],
      providers: [
        { provide: Store, useValue: storeSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrdenTrabajoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
