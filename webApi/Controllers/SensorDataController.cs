using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;

using BinApi.Models;
#nullable enable

namespace webApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SensorDataController : ControllerBase
    {
        private readonly BinContext _context;     
        private readonly IHubContext<BinDataSingalR.Hubs.BinDataHub> _binDataHub;   

        public SensorDataController(BinContext context, IHubContext<BinDataSingalR.Hubs.BinDataHub> binDataHub)
        {
            _context = context;
            _binDataHub = binDataHub; 

        }

        // GET: api/SensorData/?initialDate&latestDate
        // Latest en sensors, con la fecha 
        // Get para info de las graficas

        [HttpGet]
        public async Task<ActionResult<SensorData>> GetSensorData(DateTime initialDate, DateTime? latestDate, long binId)
        {
            List<SensorData> sensorData = new List<SensorData>();
            if (_context.SensorData == null)
            {
                return NotFound();
            }

            if(latestDate == null || DateTime.Compare(initialDate, (DateTime)latestDate) == 0){
                sensorData = await _context.SensorData.Include(s=>s.Logger).Where(
                    d => (d.Date.Year == initialDate.Year &&
                    d.Date.Month == initialDate.Month && 
                    d.Date.Date == initialDate.Date &&
                    d.BinId == binId)
                ).ToListAsync();
            }

            else if (DateTime.Compare(initialDate,(DateTime)latestDate) > 0){
                return BadRequest(new{message = "InitialDate cannot be later thant latestDate"});
            }

            else{
                try
                {
                sensorData = await _context.SensorData.Include(s=>s.Logger).Where(
                    d=> d.Date >= initialDate && 
                    d.Date <= latestDate &&
                    d.BinId == binId
                ).ToListAsync();
                }
                catch(Exception e)
                {
                    return BadRequest(new{
                        message = "An error has occured while procesing your request. Don't forget to check if the Bin Identifier is a valid one!",
                        errorString = e.GetType().ToString()
                    });
                }
            }

            return Ok(sensorData); 
        }

        [HttpGet]
        [Route("/api/SensorData/Latest")] 
        public async Task<ActionResult<SensorData>> getLatestSensorData(long? binId)
        {

            try{
                var sensorData = await _context.SensorData.OrderByDescending(s=>s.Date).FirstAsync(
                    s=>(s.Date.Year == DateTime.Now.Year &&
                        s.Date.Month == DateTime.Now.Month && 
                        s.Date.Date == DateTime.Now.Date &&
                        s.BinId == binId)
                );
                
                return Ok(sensorData);
            }
            catch(Exception e){
                return BadRequest(new{
                    message = "An error has occured while procesing your request. Don't forget to check if the Bin Identifier is a valid one!",
                    errorString = e.GetType().ToString()
                });
            }
        }


        // PUT: api/SensorData/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSensorData(long id, SensorData sensorData)
        {
            if (id != sensorData.Id)
            {
                return BadRequest();
            }

            _context.Entry(sensorData).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SensorDataExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/SensorData
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<SensorData>> PostSensorData(SensorData sensorData)
        {
          if (_context.SensorData == null)
          {
              return Problem("Entity set 'BinContext.SensorData'  is null.");
          }

            _context.SensorData.Add(sensorData);
            await _context.SaveChangesAsync();
            //send to Hub
            await _binDataHub.Clients.All.SendAsync("ReceiveDBinData", sensorData);

            return CreatedAtAction(nameof(GetSensorData), new { id = sensorData.Id }, sensorData);
        }

        // DELETE: api/SensorData/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSensorData(long id)
        {
            if (_context.SensorData == null)
            {
                return NotFound();
            }
            var sensorData = await _context.SensorData.FindAsync(id);
            if (sensorData == null)
            {
                return NotFound();
            }

            _context.SensorData.Remove(sensorData);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SensorDataExists(long id)
        {
            return (_context.SensorData?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
