namespace BinApi.Models{
    //Dependent model
    public class SensorData{
        public long Id {get; set;}
        public long BinId {get; set;}
        public DateTime Date {get; set;} = DateTime.Now;
        public int? TemperatureC {get; set;}
        public float? Humidity {get; set;}
        public float? Moisture {get; set;}
        //Foreign key
        public long LoggerId {get; set;}
        //Navigation property
        public Logger Logger {get; set;}
    }


//Primary model
    public class Bin{
        public long Id {get; set;}
        public string name {get; set;}
        public bool IsAutoEnabled {get;set;} = true;
        //Navigation property
        public List<SensorData> Sensors {get; set;}
    }


    public class Logger{
        public long Id {get; set;}
        public loggerType loggerType{get; set;}
        public string Body {get; set;} = "Null State";
    }

    public enum loggerType{
        info, warning, error
    }
}