import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BinOneComponent } from './bin-one/bin-one.component';
import { BinTwoComponent } from './bin-two/bin-two.component';
import { BinThreeComponent } from './bin-three/bin-three.component';

const routes: Routes = [
  {path:'bin-one',component:BinOneComponent},

  {path:'bin-two',component:BinTwoComponent},
  {path:'bin-three',component:BinThreeComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
