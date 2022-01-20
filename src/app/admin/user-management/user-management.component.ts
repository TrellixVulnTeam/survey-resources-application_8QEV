import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

import {
  OidcClientNotification,
  OidcSecurityService,
  OpenIdConfiguration,
  UserDataResult,
} from 'angular-auth-oidc-client';

import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { COMMA, TAB, SPACE, ENTER, U } from '@angular/cdk/keycodes';
import { Observable, of } from 'rxjs';
import { finalize, switchMap, debounceTime, tap, startWith, map, reduce, groupBy, mergeMap } from 'rxjs/operators';
import { Grid, Row } from 'gridjs';
import {
  ApplicationUser,
  UserAffiliaion,
  UserClaimCRUD,
  UserRoleCRUD,
  AgencyRoles,
  UserRolesAndClaims,
  multiTenantProfile,
  multiTenantClaim,
  Claim,
  IPresTrustProgram,
} from '../iuser';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSelect } from '@angular/material/select';
import { MatListOption } from '@angular/material/list';
import { AgencyEntity } from '../iagency';
import { UserEditComponent } from '../user-edit/user-edit.component';
import { UserInviteComponent } from '../user-invite/user-invite.component';
import { newArray } from '@angular/compiler/src/util';
//import Row from 'gridjs/dist/src/row';

export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter((item) => item.toLowerCase().indexOf(filterValue) === 0);
};

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class UserManagementComponent implements OnInit {
  onText = 'activated';
  offText = 'invited';
  onColor = 'primary';
  offColor = 'warn';

  //the logged in user's profile
  myProfile: any = null;
  isAuthorized: boolean = false;

  roleCtrl = new FormControl();
  filteredRoles: Observable<string[]>;
  clientRoles: string[] = ['surveyresorce_admin', 'surveyresource_editor', 'surveyresource_viewer'];

  userRoles: string[] = ['surveyresorce_admin'];

  // @ViewChild('roleInput') roleInput: ElementRef<HTMLInputElement>;
  // @ViewChild('auto') matAutocomplete: MatAutocomplete;

  simulateQuery = false;
  isDisabled = false;

  isTableExpanded = false;
  program = '';
  agency: AgencyEntity = null;

  // clientRoles:string[] = ["surveyresorce_admin","surveyresource_editor","surveyresource_viewer"];
  // filteredRoles:Observable<string[]>;

  agencyForm: FormGroup;
  agencyControl = new FormControl();
  agencies: AgencyEntity[] = [];
  filteredAgencies: AgencyEntity[] = [];
  selectedAgency: AgencyEntity = null;
  //roleCtrl = new FormControl();
  control = new FormControl();
  usersfc = new FormControl();
  myprogramsfc = new FormControl();
  programsfc = new FormControl();
  agenciesfc = new FormControl();
  myagenciesfc = new FormControl();
  managedUsers: UserRolesAndClaims[] = [];
  filteredUsers: UserRolesAndClaims[] = [];
  filteredUsers$: Observable<UserRolesAndClaims[]>;

  userManagerForm: FormGroup = this._formBuilder.group({
    stateGroup: '',
  });

  displayedColumns: string[] = ['name', 'email', 'claims', 'roles', 'action']; //, 'clientClaims', 'employeeClaims'
  dataSource: MatTableDataSource<UserRolesAndClaims>;

  selection = new SelectionModel<UserRolesAndClaims>(false, []);
  agencyIdFilter = new FormControl();
  agencyTypeFilter = new FormControl();
  private filterValues = { agencyName: '', agencyType: '' };

  filteredValues = {
    agencyId: '',
    agencyName: '',
    agencyType: '',
  };
  isLoading = false;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  //
  readonly separatorKeysCodes: number[] = [COMMA, TAB, ENTER];
  searchItems: string[] = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator, { static: true }) paginatorUsers: MatPaginator;
  @ViewChild(MatSort, { static: true }) sortUsers: MatSort;

  busy: boolean;

  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    public oidcSecurityService: OidcSecurityService,
    private morrisUserService: UserService,
    //private spinner: NgxSpinnerService,
    public dialog: MatDialog
  ) {
    this.oidcSecurityService.isAuthenticated$.subscribe(({ isAuthenticated }) => {
      this.isAuthorized = isAuthenticated;

      console.warn('authenticated: ', isAuthenticated);
    });
    this.oidcSecurityService.userData$.subscribe((ud) => {
      this.myProfile = ud.userData;
    });

    // this.spinner.show();

    this.morrisUserService.showMyApplicationUsers().subscribe((result) => {
      this.managedUsers = result.body;
      this.filteredUsers = result.body;
      this.filteredUsers$ = this.control.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value))
      );

      this.isLoadingResults = false;
      this.isRateLimitReached = false;
      this.resultsLength = this.managedUsers.length;
      this.dataSource = new MatTableDataSource(this.filteredUsers);
      this.dataSource.paginator = this.paginatorUsers;
      this.dataSource.sort = this.sortUsers;
    });

    this.morrisUserService.showOSTFAgencies().subscribe((result) => {
      this.agencies = result.body;
      this.filteredAgencies = result.body;
    });
  }

  private _filter(value: string): UserRolesAndClaims[] {
    const filterValue = this._normalizeValue(value);
    return this.managedUsers.filter((user) => this._normalizeValue(user.email).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  onNgModelChange(event: any) {
    console.log('on ng model change', event);
  }

  onEnter(evt: any) {
    if (evt.source.selected) {
      //alert("hello ");
    }
  }

  ngOnInit() {
    this.getUsers();

    // this.morrisUserService.showMyApplicationUsers(this.program,this.agency)
    //     .subscribe(resp => {

    //       for (const data of resp.body)
    //         {
    //           this.managedUsers.push(data);
    //         }

    //       this.isLoadingResults = false;
    //       this.isRateLimitReached = false;
    //       this.resultsLength = this.managedUsers.length;
    //       this.dataSource = new MatTableDataSource(this.managedUsers);
    //       this.dataSource.paginator = this.paginator;
    //       this.dataSource.sort = this.sort;

    //       console.log(this.managedUsers);
    //     });
  }

  filterAgencies(agencyname: string) {
    return this.agencies.filter((a) => a.agencyName.toLowerCase().indexOf(agencyname.toLowerCase()) === 0);
  }
  _agencyfilter(value: string): AgencyEntity[] {
    const filterValue = value.toLowerCase();

    return this.agencies.filter((agency) => agency.agencyName.toLowerCase().includes(filterValue));
  }

  querySearch(query: string) {
    var results = query ? this.agencies.filter(this.createFilterFor(query)) : this.agencies,
      deferred;

    return results;
  }

  searchTextChange(text: string) {
    console.log('Text changed to ' + text);
  }

  selectedItemChange(item: any) {
    console.log('Item changed to ' + JSON.stringify(item));
  }

  createFilterFor(query: string) {
    var lowercaseQuery = query.toLowerCase();

    return function filterFn(state: any) {
      return state.value.indexOf(lowercaseQuery) === 0;
    };
  }

  openDialog() {
    this.dialog.open(UserEditComponent, {
      data: this.selection,
    });
  }

  showInviteUser(program: IPresTrustProgram) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      task: 'invite',
    };

    const dialogRef = this.dialog.open(UserInviteComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((val) => {
      const user: UserRolesAndClaims = {
        email: val.email,
        firstName: val.firstName,
        lastName: val.lastName,
        //     name:val.firstName + val.lastName || val.email,
        title: val.title,
        roles: [val.role],
      };

      //alert("Dialog user:" +  JSON.stringify(user))

      // console.log("user:", user)
      this.morrisUserService.addUser(user).subscribe((user) => {
        this.getUsers();
      });
    });
  }

  showUserUpdate(user: UserRolesAndClaims) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      task: 'update',
      // id: this.selectedProgram.id,
      // name: this.selectedProgram.name,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      title: user.title,
      role: user.roles[0]['name'],
      newrole: user.roles[0]['name'],
    };

    //alert("Dialog user:" +  JSON.stringify(dialogConfig.data, null, 2))
    const dialogRef = this.dialog.open(UserInviteComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((val) => {
      const userrole: UserRoleCRUD = {
        email: val.email,
        role: val.role,
        newRole: val.newrole,
      };

      //alert("Dialog user:" +  JSON.stringify(userrole, null, 2));
    });

    // console.log("user:", user)

    // this.morrisUserService.addUser(user)
    // .subscribe(user => {

    //   this.getProgramUsers();
    // });
    this.getUsers();
  }

  deleteRole(user: UserRolesAndClaims) {
    var role = user.roles[0];
    const userrole: UserRoleCRUD = {
      email: user.email,
      role: user.roles[0]['name'],
    };
    //this.morrisUserService.deleteUserRole(userrole).subscribe();
    //alert(JSON.stringify(userrole))
  }

  deleteClaim(user: UserRolesAndClaims) {
    const userclaim: UserClaimCRUD = {
      email: user.email,
      claim: user.claims[0],
    };
    // this.morrisUserService.deleteUserRole(userrole).subscribe();
    //alert(JSON.stringify(userclaim))
  }

  showUserInvite() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      task: 'invite',
      // programid: this.selectedProgram.id,
      // name: this.selectedProgram.name,
      // agencyid: this.selectedAgency.agencyId
    };

    const dialogRef = this.dialog.open(UserInviteComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((val) => {
      console.log('Dialog output:', val);
      const user: UserRolesAndClaims = {
        email: val.email,
        firstName: val.firstName,
        lastName: val.lastName,
        userName: val.firstName + val.lastName || val.email,
        title: val.title,
        claims: [{ claimType: val.claimType, claimValue: val.claimvValue }],
      };

      console.log('user:', user);
      this.morrisUserService.addUser(user).subscribe((user) => {
        this.getUsers();
      });
    });
  }

  onAgencyChange(agency: AgencyEntity) {
    console.log(agency);
    // console.log('Selected Agency => ',  this.agency);
    this.selectedAgency = agency;
    //  this.filteredUsers = this.managedUsers.filter(u ==> U.)
  }
  onValueChange() {
    console.log(this.agency);
    console.log('Selected Agency => ', this.agency);

    // this.getAgencyUsers();
  }

  getUsers() {
    if (this.program) {
      this.morrisUserService.showMyApplicationUsers().subscribe((resp) => {
        this.managedUsers = [];
        for (const data of resp.body) {
          this.managedUsers.push(data);
        }

        this.isLoadingResults = false;
        this.isRateLimitReached = false;
        this.resultsLength = this.managedUsers.length;
        this.dataSource = new MatTableDataSource(this.filteredUsers);
        this.dataSource.paginator = this.paginatorUsers;
        this.dataSource.sort = this.sortUsers;

        console.log(this.managedUsers);
      });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editUser(user: UserRolesAndClaims): void {
    window.localStorage.removeItem('editUserId');
    window.localStorage.setItem('editUserId', user.userId.toString());
    this.router.navigate(['app-edit-user']);
  }

  // private _filterGroup(value: string): ApplicationUser[] {
  //   if (value) {
  //     return this.managedUsers
  //       .map(group => ({letter: group.letter, names: _filter(group.names, value)}))
  //       .filter(group => group.names.length > 0);
  //   }

  //   return this.managedUsers;
  // }
}
