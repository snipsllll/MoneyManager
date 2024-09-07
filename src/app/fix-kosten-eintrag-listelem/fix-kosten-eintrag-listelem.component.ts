import {Component, computed, EventEmitter, Input, Output, signal, WritableSignal} from '@angular/core';
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
  @Input() selectedElementId!: WritableSignal<number>;

  isSelected = computed(() => {
    return this.selectedElementId() === this.fixKostenEintrag.id;
  })
  showMenu = signal<boolean>(false);

  @Output() onElementClicked = new EventEmitter();

  onMenuClicked() {
    this.showMenu.set(!this.showMenu());
  }

  onBearbeitenClicked() {

  }

  onLoeschenClicked() {

  }

  onEintragClicked() {
    this.onElementClicked.emit();
    console.log(this.fixKostenEintrag)
  }
}
