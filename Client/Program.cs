using Client.Middlewares;
using Domain;
using Domain.Services;
using Infrastructure.Databases;
using Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Net.Http.Headers;
using System.Data.Common;
using Client.Utilities;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.Extensions.FileProviders;
using DocumentFormat.OpenXml.Office2016.Drawing.ChartDrawing;
using Domain.Interfaces;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.Extensions.Configuration;

var builder = WebApplication.CreateBuilder(args);


builder.Logging.AddFileLogger(opts =>
{
    builder.Configuration.GetSection("TracesSettings").Bind(opts);
});

builder.Services.Configure<IISServerOptions>(options =>
{
    options.AllowSynchronousIO = true;
});

builder.Services.AddHttpContextAccessor();


// Enforce HTTPS
builder.Services.AddHttpsRedirection(options =>
{
    options.RedirectStatusCode = StatusCodes.Status307TemporaryRedirect;
    options.HttpsPort = 443; // You can set this to your HTTPS port, 443 is default for HTTPS
});


builder.Services.AddRazorPages();
builder.Services.AddControllers();
builder.Services.AddMemoryCache();


builder.Services.AddSession(options =>
{
    // Set a short timeout for easy testing.
    options.IdleTimeout = TimeSpan.FromMinutes(60);
    // You might want to only set the application cookies over a secure connection:
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.SameSite = Microsoft.AspNetCore.Http.SameSiteMode.Strict;
    options.Cookie.HttpOnly = true;
    // Make the session cookie essential
    options.Cookie.IsEssential = true;
});



builder.Services.AddDbContext<DatabaseContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DatabaseConnection"), 
        sqlServerOptions => sqlServerOptions.EnableRetryOnFailure()
            .UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery))
    .EnableDetailedErrors(false)
    .EnableSensitiveDataLogging(false);
});

builder.Services.AddScoped<IDatabaseCommand, DatabaseCommand>();
builder.Services.AddScoped(typeof(AsyncRepository<>));
builder.Services.AddScoped<IDatabaseUnit, DatabaseUnit>();


builder.Services.AddScoped<DbConnection>(serviceProvider =>
{
    var connectionString = builder.Configuration.GetConnectionString("DatabaseConnection");
    return new SqlConnection(connectionString);
});
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));
builder.Services.AddTransient<IEmailSender, EmailSender>();




builder.Services.AddScoped<IServiceUnit, ServiceUnit>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserAccount, UserAccount>();

builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
builder.Services.AddSingleton<ICompositeViewEngine, CompositeViewEngine>();
builder.Services.AddSingleton<ITempDataProvider, CookieTempDataProvider>();

builder.Services.AddScoped<IRazorViewHtml, RazorViewHtml>();

builder.Services.AddRazorPages().AddRazorPagesOptions(options =>
{
}).AddSessionStateTempDataProvider();

builder.Services.AddControllers();


builder.Services.AddIdentity<User, IdentityRole>(options =>
{
    options.SignIn.RequireConfirmedAccount = true;
    options.User.RequireUniqueEmail = true;
})
.AddRoleManager<RoleManager<IdentityRole>>()
.AddEntityFrameworkStores<DatabaseContext>()
.AddDefaultTokenProviders();

builder.Services.Configure<IdentityOptions>(options =>
{
    // Default Password settings.
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequiredLength = 6;
});

builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = "/Security/Identity/Login";
    options.LogoutPath = "/Security/Identity/Logout";
    options.AccessDeniedPath = "/Error_403";
    options.ExpireTimeSpan = TimeSpan.FromMinutes(60);
    options.SlidingExpiration = true;
    options.Cookie.HttpOnly = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie = new CookieBuilder
    {
        IsEssential = true // required for auth to work without explicit user consent; adjust to suit your privacy policy
    };
});

builder.Services.Configure<CookiePolicyOptions>(options =>
{
    // This lambda determines whether user consent for non-essential cookies is needed for a given request.
    options.CheckConsentNeeded = context => true;
    options.MinimumSameSitePolicy = Microsoft.AspNetCore.Http.SameSiteMode.None;
    options.Secure = CookieSecurePolicy.Always;
});

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
.AddCookie(options =>
{
    options.LoginPath = "/Security/Identity/Login";
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // Secure attribute
    options.Cookie.SameSite = Microsoft.AspNetCore.Http.SameSiteMode.None; // SameSite attribute
});




var app = builder.Build();

app.Use(async (context, next) =>
{
    context.Response.Headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
    context.Response.Headers["Pragma"] = "no-cache";
    context.Response.Headers["Expires"] = "-1";
    await next();
});

app.UseHttpsRedirection();
var options = new RewriteOptions().AddRedirectToNonWwwPermanent();
app.UseRewriter(options);

app.UseStatusCodePagesWithReExecute("/Error_{0}");

app.UseMiddleware<ExceptionHandlerMiddleware>();

app.UseExceptionHandler("/Error");
// The default HSTS value is 30 days. You might want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
app.UseHsts();

app.UseCookiePolicy();
app.UseStaticFiles();


app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseSession();

app.MapRazorPages();
app.MapControllers();

app.Use(async (context, next) =>
{
	context.Response.Headers.CacheControl = "no-cache, no-store, must-revalidate";
	context.Response.Headers.Pragma= "no-cache";
	context.Response.Headers.Expires = "0";
	await next();
});

app.Run();
