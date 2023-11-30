import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { BabyPushesComponent } from './content/baby-pushes/baby-pushes.component';
import { NavbarComponent } from './header/navbar/navbar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataService } from './content/baby-pushes/baby-pushes.service';
import { HttpClientModule } from '@angular/common/http';
import { ExportService } from './shared/export.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BabyPushesComponent,
    NavbarComponent
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatButtonModule,
    MatTableModule,
    MatExpansionModule,
    CurrencyPipe,
    HttpClientModule,
    MatIconModule
  ],
  providers: [DataService, ExportService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
