import {Component, OnInit} from '@angular/core';
import {TopBarComponent} from "../top-bar/top-bar.component";
import {TopbarService} from "../topbar.service";

@Component({
  selector: 'app-fix-kosten',
  standalone: true,
  imports: [
    TopBarComponent
  ],
  templateUrl: './fix-kosten.component.html',
  styleUrl: './fix-kosten.component.css'
})
export class FixKostenComponent implements OnInit{

  constructor(private topbarService: TopbarService) {
  }

  ngOnInit() {
    this.topbarService.title.set('FIX KOSTEN');
  }

}
