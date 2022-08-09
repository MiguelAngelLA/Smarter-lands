import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { formatDate } from '@angular/common';



@Injectable({
  providedIn: 'root'
})
export class SharedService {
readonly APIUrl='https://localhost:7099/api'
  today= new Date();
  date = '';
  bin1='1';
  bin2='2';
  bin3='3';
  constructor(private http:HttpClient) { }

  getSensorData():Observable<any[]>{
    this.date = formatDate(this.today, 'yyyy-MM-dd', 'en-US');
    return this.http.get<any>(this.APIUrl + '/SensorData?initialDate='+this.date+'&binId='+this.bin1)
  }

  getSensorData2():Observable<any[]>{
    this.date = formatDate(this.today, 'yyyy-MM-dd', 'en-US');
    return this.http.get<any>(this.APIUrl + '/SensorData?initialDate='+this.date+'&binId='+this.bin2)
  }

  getSensorData3():Observable<any[]>{
    this.date = formatDate(this.today, 'yyyy-MM-dd', 'en-US');
    return this.http.get<any>(this.APIUrl + '/SensorData?initialDate='+this.date+'&binId='+this.bin3)
  }

  getSensorDate(date1:string,date2:string):Observable<any[]>{
    return this.http.get<any>(this.APIUrl + '/SensorData?initialDate='+date1+'&latestDate='+date2+'&binId='+this.bin1)
  }

  getSensorDate2(date1:string,date2:string):Observable<any[]>{
    return this.http.get<any>(this.APIUrl + '/SensorData?initialDate='+date1+'&latestDate='+date2+'&binId='+this.bin2)
  }

  getSensorDate3(date1:string,date2:string):Observable<any[]>{
    return this.http.get<any>(this.APIUrl + '/SensorData?initialDate='+date1+'&latestDate='+date2+'&binId='+this.bin3)
  }

  getLatest():Observable<any[]>{
    return this.http.get<any>(this.APIUrl + '/SensorData/Latest?'+'binId='+this.bin1);
  }

  getLatest2():Observable<any[]>{
    return this.http.get<any>(this.APIUrl + '/SensorData/Latest?'+'binId='+this.bin2);
  }

  getLatest3():Observable<any[]>{
    return this.http.get<any>(this.APIUrl + '/SensorData/Latest?'+'binId='+this.bin3);
  }




}
