using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BinApi.Models;

namespace webApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SensorDataController : ControllerBase
    {
        private readonly BinContext _context;

        public SensorDataController(BinContext context)
        {
            _context = context;

        }


        // GET: api/SensorData
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SensorData>>> GetSensorData()
        {
          var sensorData = await _context.SensorData
          .Include(l => l.Logger)
          .ToListAsync();
          
          if (_context.SensorData == null)
          {
              return NotFound();
          }
            return sensorData;
        }

        // GET: api/SensorData/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SensorData>> GetSensorData(long id)
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

            return sensorData;
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

            return CreatedAtAction("GetSensorData", new { id = sensorData.Id }, sensorData);
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
