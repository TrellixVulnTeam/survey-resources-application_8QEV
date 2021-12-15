import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailLandingComponent } from './email-landing.component';

describe('EmailLandingComponent', () => {
  let component: EmailLandingComponent;
  let fixture: ComponentFixture<EmailLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmailLandingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
