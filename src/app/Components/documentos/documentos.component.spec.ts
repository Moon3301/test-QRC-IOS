import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DocumentosComponent } from './documentos.component';

describe('DocumentosComponent', () => {
  let component: DocumentosComponent;
  let fixture: ComponentFixture<DocumentosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [  ],
      imports: [IonicModule.forRoot(), DocumentosComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
