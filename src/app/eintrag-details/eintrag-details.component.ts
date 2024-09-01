import {Component, Input, OnInit, signal} from '@angular/core';
import {Eintrag} from "../Eintrag";
import {NgIf} from "@angular/common";
import {ActivatedRoute, Route, Router} from "@angular/router";
import {DataService} from "../data.service";

@Component({
  selector: 'app-eintrag-details',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './eintrag-details.component.html',
  styleUrl: './eintrag-details.component.css'
})
export class EintragDetailsComponent implements OnInit{

  eintrag? = signal<Eintrag | undefined>(undefined);

  constructor(private router: Router, private route: ActivatedRoute, private dataService: DataService) {

  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const eintragId = +params.get('eintragId')!; // `!` stellt sicher, dass `number` immer definiert ist
      console.log(eintragId)
      this.eintrag?.set(this.dataService.getEintragById(eintragId));
    });
  }

  onBackClicked() {
    this.router.navigate(['/home']);
  }

}
