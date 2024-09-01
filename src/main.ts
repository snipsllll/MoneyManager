import {bootstrapApplication} from '@angular/platform-browser';
import {appConfig} from './app/app.config';
import {AppComponent} from './app/app.component';
import {HomeComponent} from "./app/home/home.component";
import {EditEintragComponent} from "./app/edit-eintrag/edit-eintrag.component";
import {provideRouter, Routes} from "@angular/router";
import {CreateEintragComponent} from "./app/create-eintrag/create-eintrag.component";
import {EintragDetailsComponent} from "./app/eintrag-details/eintrag-details.component";


const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'eintragDetails/:eintragId', component: EintragDetailsComponent},
  {path: 'editEintrag/:eintragId', component: EditEintragComponent},
  {path: 'createEintrag', component: CreateEintragComponent}
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes) // Provide the router with routes
  ]
}).catch(err => console.error(err));
