using Client.Utilities;
using Domain;
using Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace Client.Controllers
{
    public abstract class SolutionController(IServiceUnit service, IUserAccount user) : Controller
    {
        protected IServiceUnit _service { get; set; } = service;
        protected IUserAccount _user { get; set; } = user;
    }
}
