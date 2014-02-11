using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using TopTal.ToDoList.Models;

namespace TopTal.ToDoList.Controllers
{
    public class ToDoController : ApiController
    {
        private TopTalToDoListContext db = new TopTalToDoListContext();

        // GET api/ToDo
        public IQueryable<ToDo> GetToDoes()
        {
            return db.ToDoes;
        }

        // GET api/ToDo/5
        [ResponseType(typeof(ToDo))]
        public IHttpActionResult GetToDo(int id)
        {
            ToDo todo = db.ToDoes.Find(id);
            if (todo == null)
            {
                return NotFound();
            }

            return Ok(todo);
        }

        // PUT api/ToDo/5
        public IHttpActionResult PutToDo(int id, ToDo todo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != todo.Id)
            {
                return BadRequest();
            }

            db.Entry(todo).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ToDoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST api/ToDo
        [ResponseType(typeof(ToDo))]
        public IHttpActionResult PostToDo(ToDo todo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.ToDoes.Add(todo);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = todo.Id }, todo);
        }

        // DELETE api/ToDo/5
        [ResponseType(typeof(ToDo))]
        public IHttpActionResult DeleteToDo(int id)
        {
            ToDo todo = db.ToDoes.Find(id);
            if (todo == null)
            {
                return NotFound();
            }

            db.ToDoes.Remove(todo);
            db.SaveChanges();

            return Ok(todo);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ToDoExists(int id)
        {
            return db.ToDoes.Count(e => e.Id == id) > 0;
        }
    }
}