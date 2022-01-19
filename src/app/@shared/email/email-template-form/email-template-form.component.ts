import { Router, ActivatedRoute, ParamMap, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
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
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { EmailMessage, EmailResponse, EmailTemplate, vwEmailTemplate } from '@app/@shared/email/imessage';
import { EmailTemplateConfigService } from '@app/@shared/email/email-template-config.service';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '@env/environment';
import { HttpParams } from '@angular/common/http';
@Component({
  selector: 'app-email-template-form',
  templateUrl: './email-template-form.component.html',
  styleUrls: ['./email-template-form.component.scss'],
})
export class EmailTemplateFormComponent implements OnInit, OnChanges {
  strInsertUpdate = 'ADD TEMPLATE';
  iconInsertUpdate = 'add';
  templateId: number;

  @ViewChild('iframe', { static: false }) iframe: ElementRef;
  firstInput = 5;
  emailContent = '';
  //compRef: ComponentRef<InnerComponent>;

  emailTemplate: EmailTemplate = {
    id: null,
    clientId: environment.stsConfig.clientId,
    title: '',
    emailPurpose: '',
    emailDescription: '',
    senderName: '',
    senderEmail: '',
    to: '',
    cC: '',
    bCC: '',
    subject: '',
    messageSubtitle: '',
    textbody: '',
    htmlbody: '',
    dataSource: '',
  };

  emailForm = this.fb.group({
    id: new FormControl(),
    clientId: ['', Validators.maxLength(100)],
    summary: this.fb.group({
      title: ['', Validators.maxLength(500)],
      emailPurpose: ['', Validators.maxLength(1000)],
      emailDescription: ['', Validators.maxLength(3000)],
    }),
    sender_recipients: this.fb.group({
      senderName: ['', Validators.maxLength(50)],
      senderEmail: ['', Validators.email],
      to: ['', Validators.maxLength(1000)],
      cc: ['', Validators.maxLength(1000)],
      bcc: ['', Validators.maxLength(1000)],
    }),
    subject: ['', Validators.maxLength(500)],
    message: this.fb.group({
      messageSubtitle: ['', Validators.maxLength(250)],
      textBody: ['', Validators.maxLength(150)],
      htmlbody: ['', Validators.maxLength(150)],
      dataSource: ['', Validators.maxLength(100)],
    }),
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private emailtemplateservice: EmailTemplateConfigService,
    private fb: FormBuilder,
    private vcRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private sanitizer: DomSanitizer
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const id = +this.route.parent.snapshot.paramMap.get('id');
        this.templateId = id;
        if (id > 0) {
          this.gettemplate(this.templateId);
          this.strInsertUpdate = 'UPDATE';
          this.iconInsertUpdate = 'published_with_changes';
          // this.updateFormData();
          //TODO change submit button to SAVE TEMPLATE
        } else {
          this.updateFormData();
          this.strInsertUpdate = 'ADD TEMPLATE';
          this.iconInsertUpdate = 'add';
          //TODO change submit button to ADD TEMPLATE
        }
        alert(id);
      }
    });
  }

  ngOnInit() {}

  ngOnChanges() {
    //   alert(this.templateId);
    //   this.updateFormData();
  }

  // loadPreview() {
  //   fetch('/assets/default-email-template.html')
  //     .then((res) => res.text())
  //     .then((data) => {
  //       this.emailContent = this.sanitizer.bypassSecurityTrustHtml(data) as string;
  //     });
  // }

  gettemplate(id: number) {
    // const tid = Number(this.route.snapshot.paramMap.get('id'));

    this.emailtemplateservice.getTemplate(id).subscribe((template) => {
      this.emailTemplate = template;
      this.updateFormData();
    });
  }
  onDelete(): void {
    alert('Are You sure?');
    this.location.back();
  }
  goBack(): void {
    this.location.back();
  }
  updateFormData() {
    this.emailForm.patchValue({
      id: [this.emailTemplate.id || null],
      clientId: [this.emailTemplate.clientId || environment.stsConfig.clientId],
      summary: {
        title: [this.emailTemplate.title] || '',
        emailPurpose: [this.emailTemplate.emailPurpose] || '',
        emailDescription: [this.emailTemplate.emailDescription] || '',
      },
      sender_recipients: {
        to: [this.emailTemplate.to] || '',
        senderName: [this.emailTemplate.senderName] || '',
        senderEmail: [this.emailTemplate.senderEmail] || '',
        cc: [this.emailTemplate.cC] || '',
        bcc: [this.emailTemplate.bCC] || '',
      },
      subject: [this.emailTemplate.subject] || '',
      message: {
        messageSubtitle: [this.emailTemplate.messageSubtitle] || '',
        textbody: [this.emailTemplate.textbody] || '',
        htmlbody: [this.emailTemplate.htmlbody] || '',
        dataSource: [this.emailTemplate.dataSource] || '',
      },
    });
  }
  setupForm() {}

  submit() {
    //  let response = this.emailservice.sendEmail(this.exampleEmail).subscribe((res) => {
    console.log(this.emailForm.value);
    //   this.returnMessage = res;
    //   });
  }
}
