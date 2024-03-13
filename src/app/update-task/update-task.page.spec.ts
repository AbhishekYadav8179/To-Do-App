import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateTaskPage } from './update-task.page';

describe('UpdateTaskPage', () => {
  let component: UpdateTaskPage;
  let fixture: ComponentFixture<UpdateTaskPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UpdateTaskPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
