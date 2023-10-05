import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogService } from 'primeng/dynamicdialog';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToolbarNavigationComponent } from './components/toolbar-navigation/toolbar-navigation.component';
import { ShortenPipe } from './pipes/shorten/shorten.pipe';



@NgModule({
  declarations: [
    ToolbarNavigationComponent,
    ShortenPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    //PrimeNg
    ToolbarModule,
    CardModule,
    ButtonModule,
  ],
  exports: [ToolbarNavigationComponent, ShortenPipe],
  providers: [DialogService, CurrencyPipe]
})
export class SharedModule { }
