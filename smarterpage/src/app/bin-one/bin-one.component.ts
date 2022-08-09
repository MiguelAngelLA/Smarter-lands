import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { formatDate } from '@angular/common';
import { SharedService } from 'src/app/shared.service'
import {FormGroup, FormControl} from '@angular/forms';
import { map, Observable, Subscription, timer, share } from 'rxjs';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
declare let alertify:any;
Chart.register(...registerables);

@Component({
  selector: 'app-bin-one',
  templateUrl: './bin-one.component.html',
  styleUrls: ['./bin-one.component.css','./bin-one.component.scss']
})
export class BinOneComponent implements OnInit {
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  rxTime = new Date();

  constructor(private service:SharedService,private _mqttService: MqttService) { }
  today= new Date();
  date = '';
  hour = '';
  update = '';
  logList:any=[];
  hourList:any=[];
  BinList:any=[];
  sensorList:any=[];
  precipitation=50;
  weatherList:any=[];
  LatestSensorList:any=[];


  horaGrafica:any=[];
  temperature:any=[];
  moisture:any=[];
  humidity:any=[];

  temperatureChart:any;
  moistureChart:any;
  humidityChart:any;

  private subscription!: Subscription;
  private message!: String;
  topicname: any;
  msg: any;
  isConnected: boolean = false;

  ngOnInit(): void {
    this.getLogs();
    this.Charts();
    this.getDate();
    this.sensorData();
    this.clock();
    
  }

  clock(){
    this.subscription = timer(0, 1000)
    .pipe(
      map(() => new Date()),
      share()
    )
    .subscribe(time => {
      this.rxTime = time;
    });
  }

  regarBoton(){
    this.subscription = this._mqttService.observe('test319123089').subscribe((message: IMqttMessage) => {
      this.message = message.payload.toString();
      console.log(this.message);
    });
    this.unsafePublish();
    this.nukeRegar();

  }

  public unsafePublish(): void {
    this._mqttService.unsafePublish('test319123089', "Eduardo", {qos: 1, retain: true});
  }
  public nukeRegar() {
    this.subscription.unsubscribe();
  }

  sensorData(){
    this.service.getLatest().subscribe(res=>{
      this.LatestSensorList=res;
      this.update= new Date(this.LatestSensorList.date).toLocaleString();
    });
  }

  loadData(){
    let dateStart= formatDate(this.range.value.start, 'yyyy-MM-dd', 'en-US');
    let dateEnd= formatDate(this.range.value.end, 'yyyy-MM-dd', 'en-US');

    if(this.range.value.start==null || this.range.value.end==null){
      alertify.error('Seleccione alguna fecha');
    }else{
      this.temperatureChart.destroy();
      this.moistureChart.destroy();
      this.humidityChart.destroy();

      this.service.getSensorDate(dateStart,dateEnd).subscribe(res=>{
        this.sensorList=res;
  
        this.temperature=[];
        this.humidity=[];
        this.moisture=[];
        this.horaGrafica=[];
  
        for (const obj of this.sensorList){
          this.temperature.push(obj.temperatureC);
        }
        for (const obj of this.sensorList){
          this.humidity.push(obj.humidity);
        }
        for (const obj of this.sensorList){
          this.moisture.push(obj.moisture);
        }
        for (const obj of this.sensorList){
          let hour=new Date(obj.date).toLocaleString('en-US', { hour: 'numeric', hour12: true });
          this.horaGrafica.push(hour);
        }
  
  
         this.temperatureChart = new Chart("tempChart", {
          type: 'line',
          data: {
              labels: this.horaGrafica,
              datasets: [{
                  label: 'Temperatura', // Name the series
                  data: this.temperature, // Specify the data values array
                  fill: true,
                  borderColor: '#378C53', // Add custom color border (Line)
                  backgroundColor: '#2DC65380', // Add custom color background (Points and Fill)
                  borderWidth: 1 // Specify bar border width
              }]
          },
          options: {
            responsive: true, // Instruct chart js to respond nicely.
            maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height 
            scales: {
              x:{
                grid: {
                  display:false
                }
              },
              y: {
                  ticks: {
                      // Include Celsius
                      callback: function(value, index, ticks) {
                          return value + '°C';
                      }
                  }
              }
          }
          }
      });
  
      this.moistureChart = new Chart("dirtHumid", {
        type: 'line',
        data: {
            labels: this.horaGrafica,
            datasets: [{
                label: 'Humedad Tierra', // Name the series
                data: this.moisture, // Specify the data values array
                fill: true,
                borderColor: '#378C53', // Add custom color border (Line)
                backgroundColor: '#2DC65380', // Add custom color background (Points and Fill)
                borderWidth: 1 // Specify bar border width
            }]
        },
        options: {
          responsive: true, // Instruct chart js to respond nicely.
          maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height 
          scales: {
            x:{
              grid: {
                display:false
              }
            },
            y: {
                ticks: {
                    // Include Celsius
                    callback: function(value, index, ticks) {
                        return value + '%';
                    }
                }
            }
        }
        }
    });
  
    this.humidityChart = new Chart("airHumid", {
      type: 'line',
      data: {
          labels: this.horaGrafica,
          datasets: [{
              label: 'Humedad Aire', // Name the series
              data: this.humidity, // Specify the data values array
              fill: true,
              borderColor: '#378C53', // Add custom color border (Line)
              backgroundColor: '#2DC65380', // Add custom color background (Points and Fill)
              borderWidth: 1 // Specify bar border width
          }]
      },
      options: {
        responsive: true, // Instruct chart js to respond nicely.
        maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height 
        scales: {
          x:{
            grid: {
              display:false
            }
          },
          y: {
              ticks: {
                  // Include Celsius
                  callback: function(value, index, ticks) {
                      return value + '%';
                  }
              }
          }
      }
      }
  });
      });
    }

  }

  getLogs(){
    this.service.getSensorData().subscribe(data=>{
      this.logList=data;
      for (const obj of this.logList ){
        let hour=new Date(obj.date).toLocaleString('en-US', { hour: 'numeric', minute:'2-digit', hour12: true });
        this.hourList.push(hour);
      }
    });
  }

  getDate(){
    this.date = formatDate(this.today, 'dd MMMM yyyy', 'en-US');
    this.hour = formatDate(this.today, 'hh:mm:ss a', 'en-US');
  }

  Charts(){
    this.service.getSensorData().subscribe(data=>{
      this.sensorList=data;

      this.temperature=[];
      this.humidity=[];
      this.moisture=[];
      this.horaGrafica=[];

      for (const obj of this.sensorList){
        this.temperature.push(obj.temperatureC);
      }
      for (const obj of this.sensorList){
        this.humidity.push(obj.humidity);
      }
      for (const obj of this.sensorList){
        this.moisture.push(obj.moisture);
      }
      for (const obj of this.sensorList){
        let hour=new Date(obj.date).toLocaleString('en-US', { hour: 'numeric', minute:'2-digit', hour12: true });
        this.horaGrafica.push(hour);
      }


       this.temperatureChart = new Chart("tempChart", {
        type: 'line',
        data: {
            labels: this.horaGrafica,
            datasets: [{
                label: 'Temperatura', // Name the series
                data: this.temperature, // Specify the data values array
                fill: true,
                borderColor: '#378C53', // Add custom color border (Line)
                backgroundColor: '#2DC65380', // Add custom color background (Points and Fill)
                borderWidth: 1 // Specify bar border width
            }]
        },
        options: {
          responsive: true, // Instruct chart js to respond nicely.
          maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height 
          scales: {
            x:{
              grid: {
                display:false
              }
            },
            y: {
                ticks: {
                    // Include Celsius
                    callback: function(value, index, ticks) {
                        return value + '°C';
                    }
                }
            }
        }
        }
    });

    this.moistureChart = new Chart("dirtHumid", {
      type: 'line',
      data: {
          labels: this.horaGrafica,
          datasets: [{
              label: 'Humedad Tierra', // Name the series
              data: this.moisture, // Specify the data values array
              fill: true,
              borderColor: '#378C53', // Add custom color border (Line)
              backgroundColor: '#2DC65380', // Add custom color background (Points and Fill)
              borderWidth: 1 // Specify bar border width
          }]
      },
      options: {
        responsive: true, // Instruct chart js to respond nicely.
        maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height 
        scales: {
          x:{
            grid: {
              display:false
            }
          },
          y: {
              ticks: {
                  // Include Celsius
                  callback: function(value, index, ticks) {
                      return value + '%';
                  }
              }
          }
      }
      }
  });

  this.humidityChart = new Chart("airHumid", {
    type: 'line',
    data: {
        labels: this.horaGrafica,
        datasets: [{
            label: 'Humedad Aire', // Name the series
            data: this.humidity, // Specify the data values array
            fill: true,
            borderColor: '#378C53', // Add custom color border (Line)
            backgroundColor: '#2DC65380', // Add custom color background (Points and Fill)
            borderWidth: 1 // Specify bar border width
        }]
    },
    options: {
      responsive: true, // Instruct chart js to respond nicely.
      maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height 
      scales: {
        x:{
          grid: {
            display:false
          }
        },
        y: {
            ticks: {
                // Include Celsius
                callback: function(value, index, ticks) {
                    return value + '%';
                }
            }
        }
    }
    }
});

    });//Cierra TempChart
  }

  ChartsRefresh(){
    this.temperatureChart.destroy();
    this.moistureChart.destroy();
    this.humidityChart.destroy();

    this.service.getSensorData().subscribe(data=>{
      this.sensorList=data;

      this.temperature=[];
      this.humidity=[];
      this.moisture=[];
      this.horaGrafica=[];

      for (const obj of this.sensorList){
        this.temperature.push(obj.temperatureC);
      }
      for (const obj of this.sensorList){
        this.humidity.push(obj.humidity);
      }
      for (const obj of this.sensorList){
        this.moisture.push(obj.moisture);
      }
      for (const obj of this.sensorList){
        let hour=new Date(obj.date).toLocaleString('en-US', { hour: 'numeric', minute:'2-digit', hour12: true });
        this.horaGrafica.push(hour);
      }


       this.temperatureChart = new Chart("tempChart", {
        type: 'line',
        data: {
            labels: this.horaGrafica,
            datasets: [{
                label: 'Temperatura', // Name the series
                data: this.temperature, // Specify the data values array
                fill: true,
                borderColor: '#378C53', // Add custom color border (Line)
                backgroundColor: '#2DC65380', // Add custom color background (Points and Fill)
                borderWidth: 1 // Specify bar border width
            }]
        },
        options: {
          responsive: true, // Instruct chart js to respond nicely.
          maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height 
          scales: {
            x:{
              grid: {
                display:false
              }
            },
            y: {
                ticks: {
                    // Include Celsius
                    callback: function(value, index, ticks) {
                        return value + '°C';
                    }
                }
            }
        }
        }
    });

    this.moistureChart = new Chart("dirtHumid", {
      type: 'line',
      data: {
          labels: this.horaGrafica,
          datasets: [{
              label: 'Humedad Tierra', // Name the series
              data: this.moisture, // Specify the data values array
              fill: true,
              borderColor: '#378C53', // Add custom color border (Line)
              backgroundColor: '#2DC65380', // Add custom color background (Points and Fill)
              borderWidth: 1 // Specify bar border width
          }]
      },
      options: {
        responsive: true, // Instruct chart js to respond nicely.
        maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height 
        scales: {
          x:{
            grid: {
              display:false
            }
          },
          y: {
              ticks: {
                  // Include Celsius
                  callback: function(value, index, ticks) {
                      return value + '%';
                  }
              }
          }
      }
      }
  });

  this.humidityChart = new Chart("airHumid", {
    type: 'line',
    data: {
        labels: this.horaGrafica,
        datasets: [{
            label: 'Humedad Aire', // Name the series
            data: this.humidity, // Specify the data values array
            fill: true,
            borderColor: '#378C53', // Add custom color border (Line)
            backgroundColor: '#2DC65380', // Add custom color background (Points and Fill)
            borderWidth: 1 // Specify bar border width
        }]
    },
    options: {
      responsive: true, // Instruct chart js to respond nicely.
      maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height 
      scales: {
        x:{
          grid: {
            display:false
          }
        },
        y: {
            ticks: {
                // Include Celsius
                callback: function(value, index, ticks) {
                    return value + '%';
                }
            }
        }
    }
    }
});

    });//Cierra TempChart
  }
  getColor(colorNumber:number){
    let color = '';
    if (colorNumber == 3) {
      color = '#DE3730';
    }
    else if (colorNumber == 2) {
      color = '#EDC148';
    }
    else if (colorNumber == 1) {
      color = '#59C067';
    }
    return  color;
  }

  getIcon(iconNumber:number){
    let icon = '';
    if (iconNumber == 3) {
      icon = ' fa-solid fa-x';
    }
    else if (iconNumber == 2) {
      icon = 'fa-solid fa-exclamation';
    }
    else if (iconNumber == 1)  {
      icon = 'fa-solid fa-check';
    }
    return  icon;
  }

  getBorder(iconNumber:number){
    let icon = '';
    if (iconNumber == 3) {
      icon = 'border-red';
    }
    else if (iconNumber == 2) {
      icon = 'border-yellow';
    }
    else if (iconNumber == 1)  {
      icon = 'border-green';
    }
    return  icon;
  }

}
