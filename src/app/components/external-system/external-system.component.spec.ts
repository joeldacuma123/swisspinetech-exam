import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalSystemComponent } from './external-system.component';

describe('ExternalSystemComponent', () => {
  let component: ExternalSystemComponent;
  let fixture: ComponentFixture<ExternalSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalSystemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExternalSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
