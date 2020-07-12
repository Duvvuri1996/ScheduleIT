import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetpassowrdComponent } from './setpassword.component';

describe('SetpassowrdComponent', () => {
  let component: SetpassowrdComponent;
  let fixture: ComponentFixture<SetpassowrdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetpassowrdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetpassowrdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
