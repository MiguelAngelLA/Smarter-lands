import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'smarterpage';
  status='active';
  status2!:string;
  status3!:string;

  getColor1(){
    this.status ='active';
    this.status2 ='inactive';
    this.status3 ='inactive';        
  }

  getColor2(){
    this.status ='inactive';
    this.status2 ='active';
    this.status3 ='inactive';    
  }

  getColor3(){
    this.status ='inactive';
    this.status2 ='inactive';
    this.status3 ='active';     
  }
}
