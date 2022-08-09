import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BinOneComponent } from './bin-one/bin-one.component';
import { BinTwoComponent } from './bin-two/bin-two.component';
import { SharedService } from './shared.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { BinThreeComponent } from './bin-three/bin-three.component';
import { IMqttMessage, MqttModule, IMqttServiceOptions } from "ngx-mqtt";

export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: 'broker.hivemq.com',
  port: 8000,
  path: '/mqtt',
  protocol:"ws"
}
@NgModule({
  declarations: [
    AppComponent,
    BinOneComponent,
    BinTwoComponent,
    BinThreeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS)
  ],
  providers: [SharedService],
  bootstrap: [AppComponent]
})
export class AppModule { }
