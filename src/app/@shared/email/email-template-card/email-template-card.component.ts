import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { vwEmailTemplate } from '../imessage';
import { Router, ActivatedRoute, ParamMap, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-email-template-card',
  templateUrl: './email-template-card.component.html',
  styleUrls: ['./email-template-card.component.scss'],
})
export class EmailTemplateCardComponent implements OnInit {
  @Input() public vtemplate: vwEmailTemplate;
  @Output() selectTemplateEvent = new EventEmitter<number>();
  selected = false;
  //templateId = 0;

  selectTemplate(value: number) {
    this.selected = !this.selected;
    this.selectTemplateEvent.emit(value);
  }
  selectCard(id: number) {
    alert(id);
    this.selected = !this.selected;
  }

  constructor(
    private activatedroute: ActivatedRoute,
    private router: Router //private location: Location,
  ) {
    this.activatedroute.parent.params.subscribe((p) => {
      alert('card route parameter: ' + p.id);
      // this.templateId = p.id;
    });
  }

  ngOnInit(): void {}
}
