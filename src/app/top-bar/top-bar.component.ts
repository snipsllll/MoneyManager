import {Component, OnInit} from '@angular/core';
import {TopbarService} from "../topbar.service";

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css'
})
export class TopBarComponent implements OnInit{
  title?: string;

  constructor(private topbarService: TopbarService) {
  }

  ngOnInit() {
    this.title = this.topbarService.title();
  }
}
