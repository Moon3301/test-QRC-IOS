using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
	public abstract class Entity
	{
		public virtual int Id { get; protected set; }

		public Entity()
		{
		}
        public Entity(int id)
        {
			Id = id;
        }
    }
}
