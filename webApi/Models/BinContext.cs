using Microsoft.EntityFrameworkCore;
using System.Diagnostics.CodeAnalysis; 
using BinApi.Models;


namespace BinApi.Models{
    public class BinContext: DbContext{
        public BinContext(DbContextOptions<BinContext> options):base(options)
        {
        }

        //protected readonly IConfiguration _configuration; 
        // protected override void OnConfiguring(DbContextOptionsBuilder options){
        //    options.UseSqlServer(_configuration.GetConnectionString("SmarterLandsDB"));
        //}

        public DbSet<Bin> Bins {get; set;}
        public DbSet<SensorData> SensorData { get; set; }
        public DbSet<Logger>Logger { get; set; }
    }
}