
namespace Domain
{
    public interface IDatabaseUnit
    {
        bool IsTransactionActive { get; }

		
        IAsyncRepository<User> User { get; }
        IAsyncRepository<Equipment> Equipment { get; }
        IAsyncRepository<Category> Category { get; }
        IAsyncRepository<Labor> Labor { get; }
        IAsyncRepository<Maintenance> Maintenance { get; }
        IAsyncRepository<Organization> Organization { get; }
        IAsyncRepository<Tower> Tower { get; }
        IAsyncRepository<Building> Building { get; }

        Task CommitTransaction(CancellationToken token);
        void Dispose();
        Task SaveChangesAsync(CancellationToken token = default);
        void StartTransaction();
    }

}
