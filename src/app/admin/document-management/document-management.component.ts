import { Component, ElementRef, ViewChild, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { NumberValidators } from '../../@core/validators/number-validators';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { ENTER, COMMA, TAB } from '@angular/cdk/keycodes';
//import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
//import { ToastrService } from 'ngx-toastr'; // Alert message using NGX toastr
import { BlobService } from '../../@shared/azure-storage/blob.service';
import {
  IBlobObject,
  IBlobListRequest,
  IBlobRef,
  IBlobRenameRequest,
  IBlobFileRequest,
  IDownloadItem,
} from '../../@shared/azure-storage/iblob';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { BlobUploadComponent } from '../../@shared/azure-storage/blob-upload/blob-upload.component';
//import {EditBlobDlgComponent} from '../edit-blob-dlg/edit-blob-dlg.component';
//import {DeleteBlobDlgComponent} from '../delete-blob-dlg/delete-blob-dlg.component';
//import {RenameBlobDlgComponent} from '../rename-blob-dlg/rename-blob-dlg.component';

@Component({
  selector: 'app-document-management',
  templateUrl: './document-management.component.html',
  styleUrls: ['./document-management.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DocumentManagementComponent implements OnInit {
  isTableExpanded = false;
  displayedColumns: string[] = ['blobName', 'title', 'description', 'component', 'action'];
  dataSource: MatTableDataSource<IBlobRef>;
  selection = new SelectionModel<IBlobRef>(false, []);
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  components: string[] = [
    'Project',
    'Overview',
    'Location',
    'SiteCharacteristics',
    'Finance',
    'PlanningManagement',
    'OtherDocuments',
    'ApprovedApplication',
    'Closing',
  ];
  domIds: string[] = [
    'bylaws',
    'incorp',
    'application',
    'easement',
    'sitemap',
    'contract',
    'deed',
    'survey',
    'sitedocs',
    'photo',
    'appraisal',
    'funding',
    'conceptplan',
    'prelimplan',
    'finalplan',
    'presiteplan',
    'finalsiteplan',
    'presentationletr',
    'muniminutes',
    'pubcomments',
    'propownaccess',
    'bylaws',
    'certincorp',
    'proofcharity',
    'misc',
    'advertpub',
    'munireso',
    'contract',
    'survey',
    'deed',
    'ordinance',
    'misc',
    'deed',
    'demo',
    'reimbursment',
  ];

  asset: File = null;
  imageShow: any = '';
  email = '';
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  filelist: IBlobRef[] = [];
  filename: string = '';
  selectedBlob: IBlobRef = null;
  container: string = 'morris-test-client-localhost';
  blobUrl: string = '';
  selectedFile: IBlobRef = null;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, ENTER];

  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  program: string = 'ostf';
  agency: string = '123';
  applicationId: string = '9';
  private sub: any;
  uploadForm: FormGroup;
  downloadForm: FormGroup;
  editBlobForm: FormGroup;
  renameBlobForm: FormGroup;
  deleteBlobForm: FormGroup;
  showEditBlob: boolean = false;
  showRenameForm = false;
  showDeleteForm = false;
  showAddForm = false;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public oidcSecurityService: OidcSecurityService,
    private azureStorageService: BlobService,
    // private spinner: NgxSpinnerService,
    public dialog: MatDialog //  public toastr: ToastrService,  // Toastr service for alert message
  ) {
    this.oidcSecurityService.userData$.subscribe((ud) => {
      this.email = ud.userData["email"] || "";
    });
  }

  ngOnInit() {
    this.getBlobList();
  }

  getBlobList() {
    let req: IBlobListRequest = {
      containerName: this.container,
      prefix: '',
      partialstring: '',
      metadatakey: '',
      metadatavalue: '',
      extensions: [],
    };

    this.azureStorageService.listFiles(req).subscribe((resp) => {
      this.filelist = resp.body;
      this.dataSource = new MatTableDataSource(this.filelist);
      this.isLoadingResults = false;
      this.isRateLimitReached = false;
      this.resultsLength = this.filelist.length;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  downloadBlob(blobref: IBlobRef) {
    let blobrequest: IBlobFileRequest = { containerName: blobref.containerName, blobName: blobref.blobName };

    this.azureStorageService.downloadFile(blobrequest);
    // .subscribe(results => this.contents = results);
  }

  download() {
    let blobrequest: IBlobFileRequest = {
      containerName: this.selectedBlob.containerName,
      blobName: this.selectedBlob.blobName,
    };

    this.azureStorageService.downloadFileII(blobrequest);
    // .subscribe(results => this.contents = results);
  }

  testDownloadFiles() {
    let files: IDownloadItem[] = [
      { fileName: '', title: '' },
      { fileName: '', title: '' },
    ];
    alert(JSON.stringify(files));
  }

  ngOnDestroy() {
    // this.sub.unsubscribe();
  }

  ResetForm() {
    this.uploadForm.reset();
  }

  GetFileName(path: string) {
    let fn = path.substring(path.lastIndexOf('\\') + 1);
    fn = fn ? fn : path.substring(path.lastIndexOf('/') + 1);
    return fn;
  }

  onFileChange(event: any) {
    this.filename = event.value;
  }
  showEditBlobDialog(row: IBlobObject) {
    console.log(row);
    // this.dialog.open(EditBlobDlgComponent, {
    //   data: row
    // });
  }
  showDeleteBlobDialog(row: any) {
    // this.dialog.open(DeleteBlobDlgComponent, {
    //   data: row
    // });
    let blobrequest: IBlobFileRequest = { containerName: row.containerName, blobName: row.blobName };
    this.azureStorageService.deleteFile(blobrequest);

    this.getBlobList();
  }
  showUploadBlobDialog() {
    this.dialog.open(BlobUploadComponent);
  }
  showRenameBlobDialog(blob: any) {
    console.log(blob);
    // const dialogConfig = new MatDialogConfig();

    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;

    // dialogConfig.data = {
    //     blob
    // };

    // const dialogRef = this.dialog.open(RenameBlobDlgComponent,
    //     dialogConfig);

    // dialogRef.afterClosed().subscribe(
    //     val => {console.log("Dialog output:", val)
    //     this.getBlobList();

    //   }

    // );
  }

  testSelectedFile(row: any) {
    this.filename = row.blobName;
    this.selectedBlob = row;
    this.GetSelectedFile();

    this.downloadForm = this.fb.group({
      blobName: [this.selectedBlob.blobName || '', [Validators.maxLength(40)]],
      containerName: [this.selectedBlob.containerName || 'pres-trust-client', [Validators.required]],
    });
  }
  toggleEditBlobForm() {
    this.showEditBlob = !this.showEditBlob;
  }

  GetSelectedFile() {
    // let bref:IBlobFileRequest = {fileName:this.filename, containerName:this.container}
    let url: string = `https://mcprima.blob.core.windows.net/${this.selectedBlob.containerName}/${this.selectedBlob.blobName}`;

    return url;
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
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  GetSelectedImage() {
    let bref: IBlobFileRequest = {
      blobName: this.selectedFile.blobName,
      containerName: this.selectedFile.containerName,
    };
    return this.azureStorageService.downloadFile(bref);
  }

  GetFileWithoutExtension(path: string) {
    return path.substring(0, path.lastIndexOf('.'));
  }
  GetFileExtension(path: string) {
    return path.substring(path.lastIndexOf('.') + 1);
  }

  updateBlobMetadata() {
    //blobref: IBlobRef
    this.editBlobForm.patchValue({
      containerName: this.selectedBlob.containerName,
      blobName: this.selectedBlob.blobName,
    });
    //alert(JSON.stringify(this.editBlobForm.value));
    let result = this.azureStorageService.updateMetadata(this.editBlobForm.value);
    //alert(result);
  }
}
