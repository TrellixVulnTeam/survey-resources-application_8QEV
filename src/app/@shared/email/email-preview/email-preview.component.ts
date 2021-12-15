import {
  Component,
  OnInit,
  Input,
  OnChanges,
  ElementRef,
  ViewChild,
  ComponentRef,
  ViewContainerRef,
  ComponentFactoryResolver,
} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { EmailMessage, EmailResponse, EmailTemplate, vwEmailTemplate } from '@app/@shared/email/imessage';
import { EmailTemplateConfigService } from '@app/@shared/email/email-template-config.service';
@Component({
  selector: 'app-email-preview',
  templateUrl: './email-preview.component.html',
  styleUrls: ['./email-preview.component.scss'],
})
export class EmailPreviewComponent implements OnInit {
  private sub: any;
  parentRouteId: number;
  // @Input() templateId: number = null;
  emailContent = '';
  emailTemplate: EmailTemplate;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private emailtemplateservice: EmailTemplateConfigService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.parent.parent.params.subscribe((params) => {
      this.parentRouteId = params['id'];
      this.gettemplate(this.parentRouteId);
      this.loadPreview();
    });
  }

  loadPreview() {
    fetch('/assets/default-email-template.html')
      .then((res) => res.text())
      .then((data) => {
        this.emailContent = this.sanitizer.bypassSecurityTrustHtml(data) as string;
      });
  }

  gettemplate(id: number) {
    //const tid = Number(this.route.snapshot.paramMap.get('id'));
    //alert('RouteId:' + id.toString());
    this.emailtemplateservice.getTemplate(id).subscribe((template) => {
      this.emailTemplate = template;
      // this.updateFormData()
    });
  }
}
