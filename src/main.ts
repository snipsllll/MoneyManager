import {bootstrapApplication} from '@angular/platform-browser';
import {AppComponent} from './app/app.component';
import {HomeComponent} from "./app/home/home.component";
import {EditEintragComponent} from "./app/edit-eintrag/edit-eintrag.component";
import {provideRouter, Routes} from "@angular/router";
import {CreateEintragComponent} from "./app/create-eintrag/create-eintrag.component";
import {EintragDetailsComponent} from "./app/eintrag-details/eintrag-details.component";
import {provideZoneChangeDetection} from "@angular/core";


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'eintragDetails/:eintragId', component: EintragDetailsComponent},
  {path: 'editEintrag/:eintragId', component: EditEintragComponent},
  {path: 'createEintrag', component: CreateEintragComponent}
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideZoneChangeDetection({ eventCoalescing: true })// Provide the router with routes
  ]
}).catch(err => console.error(err));
