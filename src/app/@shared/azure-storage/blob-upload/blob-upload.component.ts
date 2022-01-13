import {
  Component,
  Inject,
  ElementRef,
  ViewChild,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AuthService } from '@app/auth';
//import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import { BlobService } from '../blob.service';
import { IBlobObject, IBlobListRequest, IBlobRef, IBlobRenameRequest, IBlobFileRequest } from '../iblob';

@Component({
  selector: 'app-blob-upload',
  templateUrl: './blob-upload.component.html',
  styleUrls: ['./blob-upload.component.scss'],
})
export class BlobUploadComponent implements OnInit {
  program: string = 'ostf';
  agency: string = '123';
  applicationId: string = '9';
  Blobref: any = null;
  email: string = '';
  uploadForm: FormGroup;
  imageShow: any = '';

  constructor(
    private dialogRef: MatDialogRef<BlobUploadComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private azureStorageService: BlobService,
    // private spinner: NgxSpinnerService,
    public dialog: MatDialog
  ) {
    this.Blobref = data;
    this.authService.userData.subscribe((res) => {
      this.email = res.email;
    });
  }
  ngOnInit() {
    this.configForm();
  }

  ngOnDestroy() {}

  private configForm() {
    this.uploadForm = this.fb.group({
      asset: File[''],
      container: ['pres-trust-client', [Validators.required]],
      saveAsFileName: ['', [Validators.maxLength(40)]],
      title: ['', [Validators.maxLength(40)]],
      caption: ['', [Validators.maxLength(40)]],
      altText: ['', [Validators.maxLength(40)]],
      refDate: ['', [Validators.maxLength(40)]],
      latitude: ['', [Validators.maxLength(40)]],
      longitude: ['', [Validators.maxLength(40)]],
      description: ['', [Validators.maxLength(40)]],
      category: ['', [Validators.maxLength(40)]],
      user: [this.email, [Validators.maxLength(40)]],
      owner: ['', [Validators.maxLength(40)]],
      component: ['', [Validators.maxLength(40)]],
      domId: ['', [Validators.maxLength(40)]],
    });
  }

  GetInputFile(event: any) {
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      this.imageShow = (<FileReader>event.target.files[0]).result; //reader.result;
      // this.uploadForm.patchValue({
      //   asset:reader.result
      // })

      this.uploadForm.get('asset').setValue(event.target.files[0]);
    }
  }

  addDocument() {
    // Make sure to create a deep copy of the form-model
    let result = this.uploadForm.value;
    var formData: any = new FormData();
    let filename = result.asset.name;
    let title = this.capitalize(result.title || this.GetFileWithoutExtension(filename));
    formData.append('title', title);
    formData.append('asset', result.asset);
    formData.append('container', 'pres-trust-client');

    let saveAsFileName =
      this.program +
      '-' +
      this.agency +
      '-' +
      this.applicationId +
      '-' +
      this.generate_random_string(3) +
      '.' +
      this.GetFileExtension(filename);

    formData.append('saveAsFileName', result.saveAsFileName || '');
    formData.append('caption', result.caption);
    formData.append('altText', result.altText);
    formData.append('refDate', result.refDate);
    formData.append('latitude', result.latitude);
    formData.append('longitude', result.longitude);
    formData.append('description', result.description || '');
    formData.append('category', result.category || '');
    formData.append('user', this.email || '');
    formData.append('owner', this.agency || '');
    formData.append('component', this.constructor.name || '');
    formData.append('domId', '');

    //alert(JSON.stringify(formData)) ;
    this.azureStorageService.uploadFile(formData);

    this.ResetForm(); // Reset form when clicked on reset button
  }

  ResetForm() {
    this.uploadForm.reset();
  }

  GetFileWithoutExtension(path: string) {
    return path.substring(0, path.lastIndexOf('.'));
  }
  GetFileExtension(path: string) {
    return path.substring(path.lastIndexOf('.') + 1);
  }

  generate_random_string(string_length: number) {
    let random_string = '';
    let random_ascii;
    for (let i = 0; i < string_length; i++) {
      random_ascii = Math.floor(Math.random() * 25 + 97);
      random_string += String.fromCharCode(random_ascii);
    }
    return random_string;
  }
  capitalize = (s: string) => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
}
