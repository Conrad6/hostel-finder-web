import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { SearchResultPageComponent } from './search-result-page/search-result-page.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/hostels' },
  { path: 'hostels', loadChildren: () => import('./hostels/hostels.module').then(m => m.HostelsModule) },
  { path: 'login', component: LoginComponent, },
  { path: 'search', component: SearchResultPageComponent },
  { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule) }
];

@NgModule({
  declarations: [
    AppComponent,
    SearchResultPageComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem('authToken'),
        allowedDomains: [environment.apiOrigin],
        skipWhenExpired: true,
        disallowedRoutes: [`/users/login`]
      }
    }),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
