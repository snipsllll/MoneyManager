import {Component, Input, signal} from '@angular/core';
import {FixKostenEintrag} from "../../ClassesInterfacesEnums";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-fix-kosten-eintrag-listelem',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './fix-kosten-eintrag-listelem.component.html',
  styleUrl: './fix-kosten-eintrag-listelem.component.css'
})
export class FixKostenEintragListelemComponent {
  @Input() fixKostenEintrag!: FixKostenEintrag;
  showMenu = signal<boolean>(false);


  onMenuClicked() {
    this.showMenu.set(!this.showMenu());
  }

  onBearbeitenClicked() {
    console.log(2)
  }

  onLoeschenClicked() {
    console.log(3)
  }

  onEintragClicked() {
    console.log(4)
  }
}
