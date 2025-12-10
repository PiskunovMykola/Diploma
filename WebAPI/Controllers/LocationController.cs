using Microsoft.AspNetCore.Mvc;
using WebAPI.Data;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocationController : ControllerBase
    {
        private readonly DataContext dc;
        public LocationController(DataContext dc){
            this.dc = dc;
        }
        [HttpGet("")]
        public IActionResult GetLocations()
        {
            var locations = dc.Locations.ToList();
            return Ok(locations);
        }
    }
}
