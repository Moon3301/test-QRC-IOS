using Microsoft.EntityFrameworkCore;
using System.Transactions;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Domain.Services
{


	public class Service(IDatabaseUnit database, IDatabaseCommand command)
    {
        protected readonly IDatabaseUnit _database = database;
        protected readonly IDatabaseCommand _command = command;


        public void Start()
        {
            _database.StartTransaction();
        }
        public async Task Commit(CancellationToken token)
        {
           await _database.SaveChangesAsync(token);

            if (_database.IsTransactionActive)
            {
                await _database.CommitTransaction(token);
            }
        }

    }





    public abstract class Command(IDatabaseCommand command)
    {
		protected readonly IDatabaseCommand _command = command;
	}


}
