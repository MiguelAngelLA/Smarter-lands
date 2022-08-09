using Microsoft.EntityFrameworkCore;
using Swashbuckle;
using BinApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
string connection = builder.Configuration.GetConnectionString("SmarterLandsDB");
builder.Services.AddControllers();
builder.Services.AddDbContext<BinContext>(opt=>opt.UseSqlServer(connection));
builder.Services.AddSignalR();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "SmarterApi", Version = "v1" });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "Specific Origins",
                      policy  =>
                      {
                          policy.WithOrigins("https://localhost:4200")
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .SetIsOriginAllowed((host)=>true)
                          .AllowCredentials();
                      });
});

var app = builder.Build();
app.UseRouting();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "SmarterApi v1"));
    app.UseCors();
}

app.UseCors("Specific Origins");

app.UseHttpsRedirection();
app.UseAuthorization();

app.UseEndpoints(e=>{
    e.MapControllers();
    e.MapHub<BinDataSingalR.Hubs.BinDataHub>("api/Hubs/BinDataStream");
    });

//SignalR
app.Run();
