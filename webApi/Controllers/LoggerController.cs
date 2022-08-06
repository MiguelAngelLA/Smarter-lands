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
    public class LoggerController : ControllerBase
    {
        private readonly BinContext _context;

        public LoggerController(BinContext context)
        {
            _context = context;
        }

        // GET: api/Logger
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Logger>>> GetLogger()
        {
          if (_context.Logger == null)
          {
              return NotFound();
          }
            return await _context.Logger.ToListAsync();
        }

        // GET: api/Logger/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Logger>> GetLogger(long id)
        {
          if (_context.Logger == null)
          {
              return NotFound();
          }
            var logger = await _context.Logger.FindAsync(id);

            if (logger == null)
            {
                return NotFound();
            }

            return logger;
        }

        // PUT: api/Logger/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLogger(long id, Logger logger)
        {
            if (id != logger.Id)
            {
                return BadRequest();
            }

            _context.Entry(logger).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LoggerExists(id))
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

        // POST: api/Logger
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Logger>> PostLogger(Logger logger)
        {
          if (_context.Logger == null)
          {
              return Problem("Entity set 'BinContext.Logger'  is null.");
          }
            _context.Logger.Add(logger);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLogger", new { id = logger.Id }, logger);
        }

        // DELETE: api/Logger/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLogger(long id)
        {
            if (_context.Logger == null)
            {
                return NotFound();
            }
            var logger = await _context.Logger.FindAsync(id);
            if (logger == null)
            {
                return NotFound();
            }

            _context.Logger.Remove(logger);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool LoggerExists(long id)
        {
            return (_context.Logger?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
