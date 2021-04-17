import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './components/search/search.component';
import { SynonymComponent } from './components/synonym/synonym.component';


const routes: Routes = [
  { path: '', component: SearchComponent },
  { path: 'synonyms', component: SynonymComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
