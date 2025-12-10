using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using WebAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// Получаем конфигурацию из построителя
var configuration = builder.Configuration;

// Добавляем сервисы для контейнера
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Добавляем DataContext и используем строку подключения из конфигурации
builder.Services.AddDbContext<DataContext>(options => 
    options.UseSqlServer(configuration.GetConnectionString("Default")));

var app = builder.Build();

// Настройка пайплайна HTTP-запросов
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Пример маршрута WeatherForecast
var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast")
.WithOpenApi();

// Маршрут для LocationController
app.MapGet("/api/location", () =>
{
    return new string[] { "Ukraine", "Poland" };
})
.WithName("GetLocation")
.WithOpenApi();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
