import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TranscriptComponent } from './transcript/transcript.component';
import { ConnectFormComponent } from './connect-form/connect-form.component';
import { FormsModule } from '@angular/forms';
import { ChatInputComponent } from './chat-input/chat-input.component';

@NgModule({
  declarations: [
    AppComponent,
    TranscriptComponent,
    ConnectFormComponent,
    ChatInputComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
