using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BinApi.Models;

namespace webApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BinsController : ControllerBase
    {
        private readonly BinContext _context;
        //private readonly Logger _logger;

        public BinsController(BinContext context)
        {
            _context = context;
            //_logger = logger;
        }


        // GET: api/Bins
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Bin>>> GetBins()
        {
            var binData = await _context.Bins
            .Include(s=>s.Sensors).
            ThenInclude(sd=>sd.Logger).
            ToListAsync();

          if (_context.Bins == null)
          {
              return NotFound();
          }

            return binData; //_context.Bins.ToListAsync();
        }

        // GET: api/Bins/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Bin>> GetBin(long id)
        {
          if (_context.Bins == null)
          {
              return NotFound();
          }
            var bin = await _context.Bins.FindAsync(id);

            if (bin == null)
            {
                return NotFound();
            }

            return bin;
        }

        // PUT: api/Bins/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBin(long id, Bin bin)
        {
            if (id != bin.Id)
            {
                return BadRequest();
            }

            _context.Entry(bin).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BinExists(id))
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

        // POST: api/Bins
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Bin>> PostBin(Bin bin)
        {
          if (_context.Bins == null)
          {
              return Problem("Entity set 'BinContext.Bins'  is null.");
          }
            _context.Bins.Add(bin);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBin", new { id = bin.Id }, bin);
        }

        // DELETE: api/Bins/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBin(long id)
        {
            if (_context.Bins == null)
            {
                return NotFound();
            }
            var bin = await _context.Bins.FindAsync(id);
            if (bin == null)
            {
                return NotFound();
            }

            _context.Bins.Remove(bin);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BinExists(long id)
        {
            return (_context.Bins?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
