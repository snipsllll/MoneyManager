import {bootstrapApplication} from '@angular/platform-browser';
import {AppComponent} from './app/app.component';
import {HomeComponent} from "./app/home/home.component";
import {EditBuchungComponent} from "./app/edit-buchung/edit-buchung.component";
import {provideRouter, Routes} from "@angular/router";
import {CreateBuchungComponent} from "./app/create-buchung/create-buchung.component";
import {BuchungDetailsComponent} from "./app/buchung-details/buchung-details.component";
import {provideZoneChangeDetection} from "@angular/core";
import {BudgetComponent} from "./app/budget/budget.component";


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'buchungDetails/:buchungsId', component: BuchungDetailsComponent},
  {path: 'editBuchung/:buchungsId', component: EditBuchungComponent},
  {path: 'createBuchung', component: CreateBuchungComponent},
  {path: 'budget', component: BudgetComponent}
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideZoneChangeDetection({ eventCoalescing: true })// Provide the router with routes
  ]
}).catch(err => console.error(err));

function setRealViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Call this function on load and on resize
setRealViewportHeight();
window.addEventListener('resize', setRealViewportHeight);
