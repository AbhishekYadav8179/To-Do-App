import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToDoFormPage } from './to-do-form.page';

describe('ToDoFormPage', () => {
  let component: ToDoFormPage;
  let fixture: ComponentFixture<ToDoFormPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ToDoFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
