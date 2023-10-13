import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'waitpage',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  
  { path: 'login', loadChildren: './account/login/login.module#LoginPageModule' },
  { path: 'forgot', loadChildren: './account/forgot/forgot.module#ForgotPageModule' },
  { path: 'profile', loadChildren: './account/profile/profile.module#ProfilePageModule' },
   
  { path: 'detail', loadChildren: './detail/detail.module#DetailPageModule' },
  {
    path: 'chats',
    loadChildren: () => import('./chat-page/chat-page.module').then( m => m.ChatPagePageModule)
  }, 
  {
    path: 'chat-service/:service/:userTo',
    loadChildren: () => import('./chat-service/chat-service.module').then( m => m.ChatServicePageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./account/signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'locked',
    loadChildren: () => import('./locked/locked.module').then( m => m.LockedPageModule)
  },  
  {
    path: 'welcome',
    loadChildren: () => import('./welcome/welcome.module').then( m => m.WelcomePageModule)
  },
  {
    path: 'waitpage',
    loadChildren: () => import('./waitpage/waitpage.module').then( m => m.WaitpagePageModule)
  },
  {
    path: 'details-vehicle',
    loadChildren: () => import('./details-vehicle/details-vehicle.module').then( m => m.DetailsVehiclePageModule)
  },
  {
    path: 'add-services',
    loadChildren: () => import('./list-services/add-services/add-services.module').then( m => m.AddServicesPageModule)
  },
  {
    path: 'list-services',
    loadChildren: () => import('./list-services/list-services.module').then( m => m.ListServicesPageModule)
  },
  {
    path: 'request-services',
    loadChildren: () => import('./request-services/request-services.module').then( m => m.RequestServicesPageModule)
  },
  {
    path: 'wallet',
    loadChildren: () => import('./wallet/wallet.module').then( m => m.WalletPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
