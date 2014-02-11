using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TopTal.ToDoList.Models
{
    public class ToDo
    {
        public int Id { get; set; }
        public string Owner { get; set; }
        public string Description { get; set; }
        public DateTime DueDate { get; set; }
        public int Priority { get; set; }
        public Boolean Completed { get; set; }
    }
}