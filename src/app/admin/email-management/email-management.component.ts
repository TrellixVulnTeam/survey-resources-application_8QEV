import { Component, OnInit } from '@angular/core';
import { EmailService } from '@app/@shared/email/email.service';
import { EmailTemplateConfigService } from '@app/@shared/email/email-template-config.service';
import { EmailMessage, EmailResponse, EmailTemplate, vwEmailTemplate } from '@app/@shared/email/imessage';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AuthService } from '@app/auth/authentication.service';
import { environment } from 'src/environments/environment';
//import {EmailTemplateCardModule} from '@shared/email/email-template-card/email-template-card.module';
import { EmailTemplateCardComponent } from '@shared/email/email-template-card/email-template-card.component';
import { TabItem } from '@app/@core/data/models/tab-item';
@Component({
  selector: 'app-email-management',
  templateUrl: './email-management.component.html',
  styleUrls: ['./email-management.component.scss'],
})

// https://stackblitz.com/edit/master-detail-demo?file=src%2Fapp%2Femployee-list%2Femployee-list.component.ts
export class EmailManagementComponent implements OnInit {
  tabs: TabItem[] = [
    {
      label: 'New',
      icon: 'add',
      route: ['/admin/email/create'],
    },
    {
      label: 'Details Edit',
      icon: 'edit',
      route: ['"/admin/email","3","edit"'],
    },
    {
      label: 'Preview',
      icon: 'search',
      route: ['"/admin/email","3","preview"'],
    },
  ];

  customerName = 'Noah';
  clientName = environment.clientId;
  clientDescription = 'An Angular Starter Project for...';
  emailTemplates: vwEmailTemplate[];
  emailTemplate: EmailTemplate;
  templateId: number;

  emailForm = new FormGroup({});

  emailMessageForm: FormGroup;

  htmlbody_prefix: string = `<!DOCTYPE html PUBLIC ""-//W3C//DTD XHTML 1.0 Transitional//EN"" ""http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"">
  <html xmlns=""http://www.w3.org/1999/xhtml"">
      <head>
          <meta http-equiv=""Content-Type"" content=""text/html; charset=UTF-8"" />
          <title>Welcome Invitation Email</title>
          <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"" />
      </head>
      <body style=""margin: 0; padding: 0;"">
          <table border=""0"" cellpadding=""0"" cellspacing=""0"" width=""100%"">
              <tr>
                  <td style=""padding: 10px 0 30px 0;"">
                      <table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" width=""600"" style=""border: 1px solid #cccccc; border-collapse: collapse;"">
                          <tr>
                              <td align=""center"" bgcolor=""#003300"" style=""padding: 10px 0 0 0; color: #ffffff; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;"">
                                  <p>Morris County Web Application</p>
                              </td>
                          </tr>
                          <tr>
                              <td align=""center"" bgcolor=""#003300"" style=""padding: 0 0 0 0; color: #ffffff; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;"">
                                  <img src=""https://mcprima.blob.core.windows.net/morris-web-resources/morris-county-seal-tranparency.png"" alt=""Creating Email Magic"" width=""75"" height=""75"" style=""display: block;"" />
                              </td>
                          </tr>
                          <tr>
                              <td align=""center"" bgcolor=""#003300"" style=""padding: 0 0 0 0; color: #ffffff; font-size: 24px; font-weight: bold; font-family: Arial, sans-serif;"">
                                  <p>" + $"{clientName}" + @"</p>
                              </td>
                          </tr>
                          <tr>
                              <td align=""center"" bgcolor=""#003300"" style=""padding: 0 0 10px 0; color: #ffffff; font-size: 14px; font-weight: bold; font-family: Arial, sans-serif;"">
                                  <p>" + $"{clientDescription}" + @"</p>
                              </td>
                          </tr>
                          <tr>
                          <td bgcolor=""#ffffff"" style=""padding: 40px 30px 40px 30px;"">`;
  htmlbody_suffix: string = `</td>
  </tr>
  <tr>
      <td bgcolor=""#ee4c50"" style=""padding: 30px 30px 30px 30px;"">
          <table border=""0"" cellpadding=""0"" cellspacing="""" width=""100%"">
              <tr>
                  <td style=""color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;"" width=""75%"">
                      &reg; Morris County Office of Information Technology, 2020<br />
                    
                  </td>
                  <td align=""right"" width=""25%"">
                      <table border=""0"" cellpadding=""0"" cellspacing=""0"">
                          <tr>
                              <td style=""font-family: Arial, sans-serif; font-size: 12px; font-weight: bold;"">
                                  <a href=""http://www.twitter.com/"" style=""color: #ffffff;"">
                                      <img src=""https://s3-us-west-2.amazonaws.com/s.cdpn.io/210284/tw.gif"" alt=""Twitter"" width=""38"" height=""38"" style=""display: block;"" border=""0"" />
                                  </a>
                              </td>
                              <td style=""font-size: 0; line-height: 0;"" width=""20"">&nbsp;</td>
                              <td style=""font-family: Arial, sans-serif; font-size: 12px; font-weight: bold;"">
                                  <a href=""http://www.twitter.com/"" style=""color: #ffffff;"">
                                      <img src=""https://s3-us-west-2.amazonaws.com/s.cdpn.io/210284/fb.gif"" alt=""Facebook"" width=""38"" height=""38"" style=""display: block;"" border=""0"" />
                                  </a>
                              </td>
                          </tr>
                      </table>
                  </td>
              </tr>
          </table>
      </td>
  </tr>
</table>
</td>
</tr>
</table>
</body>
</html>`;

  exampleEmail: EmailMessage = {
    subject: 'Test Email',
    to: 'srice@co.morris.nj.us',
    senderName: 'Program Admin',
    senderEmail: 'mcgis@co.morris.nj.us',
    cc: null,
    bcc: null,
    textbody: 'Test Email From Angular Client',
    htmlbody: `<table border=""0"" cellpadding=""0"" cellspacing=""0"" width=""100%"">
    <tr>
        <td style=""color: #153643; font-family: Arial, sans-serif; font-size: 24px;"">
            <b>" + $"{messageSubtitle}" + @"</b>
        </td>
    </tr>
    <tr>
        <td style=""padding: 20px 0 30px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;"">
        Greetings,<br /><br />This email is to inform you that an access role has been added or modified for you in the " +
         $"{clientName}" + @" Web application. Please log in to application to explore your updated capabilities.<br/><br/>
        
        
        Application address: " +  $"<a href='{clientUrl}'>{clientUrl}</a><br /><br />" +
        @"If you have any questions, or beleive that you've received this email by mistake; please reply back to the administrator 
        to resolve the problem.
        <br /><br />
        Regards,<br /><br />

        Program Administrator
        </td>
    </tr>
</table>`,
    attachments: null,
  };

  returnMessage: EmailResponse = null;
  constructor(
    private activatedroute: ActivatedRoute,
    private router: Router,
    private emailservice: EmailService,
    private emailtemplateservice: EmailTemplateConfigService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.activatedroute.params.subscribe((p) => {
      console.log('emc route parameter: ' + p.id);
      this.templateId = p.id;
    });
    this.setupForm();
    this.emailtemplateservice.getTemplates(this.clientName).subscribe((result) => {
      this.emailTemplates = result.body;
      console.log('here!')!;
      console.log(this.emailTemplates);
    });
  }

  setupForm() {
    this.emailForm = this.fb.group({
      subject: [this.exampleEmail.subject],
      to: [this.exampleEmail.to],
      senderName: [this.exampleEmail.senderName],
      senderEmail: [this.exampleEmail.senderEmail],
      cc: [this.exampleEmail.cc],
      bcc: [this.exampleEmail.bcc],
      textbody: [this.exampleEmail.textbody],
      htmlbody: [this.exampleEmail.htmlbody],
    });
  }
  selectTemplate(id: number) {
    alert('selectTemplate: ' + id.toString());
    this.router.navigate(['/admin/email', id, 'preview']);
    this.templateId = id;
  }

  submit() {
    let response = this.emailservice.sendEmail(this.exampleEmail).subscribe((res) => {
      console.log(res);
      this.returnMessage = res;
    });
  }
}
