import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BabyPushesComponent } from './content/baby-pushes/baby-pushes.component';

const routes: Routes = [{
  path: '',
  component: BabyPushesComponent
},{
  path: 'baby-pushes',
  component: BabyPushesComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
