import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ToDoFormPage } from './to-do-form.page';

const routes: Routes = [
  {
    path: '',
    component: ToDoFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ToDoFormPageRoutingModule {}
