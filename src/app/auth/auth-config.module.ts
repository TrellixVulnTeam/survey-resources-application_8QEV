import { NgModule } from '@angular/core';
import { AuthModule, LogLevel } from 'angular-auth-oidc-client';
import { environment } from '@env/environment';

@NgModule({
  imports: [
    AuthModule.forRoot({
      config: {
        authority: environment.stsConfig.authority,
        redirectUrl: environment.stsConfig.redirectUri,
        postLogoutRedirectUri: environment.stsConfig.postLogoutRedirectUri,
        clientId: environment.stsConfig.clientId,
        scope: environment.stsConfig.scopes,
        responseType: environment.stsConfig.responseType,
        // autoUserInfo: true,
        silentRenew: environment.stsConfig.silentRenew,
        useRefreshToken: environment.stsConfig.useRefreshToken,
        logLevel: LogLevel.Debug,
      },
    }),
  ],
  exports: [AuthModule],
})
export class AuthConfigModule {}
