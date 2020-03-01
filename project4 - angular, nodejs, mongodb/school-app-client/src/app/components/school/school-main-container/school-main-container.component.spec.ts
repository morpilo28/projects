import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolMainContainerComponent } from './school-main-container.component';

describe('SchoolMainContainerComponent', () => {
  let component: SchoolMainContainerComponent;
  let fixture: ComponentFixture<SchoolMainContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchoolMainContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolMainContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
