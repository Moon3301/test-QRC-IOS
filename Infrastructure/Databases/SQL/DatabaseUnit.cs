using Domain;
using Microsoft.Data.SqlClient.DataClassification;
using System.Transactions;

namespace Infrastructure.Databases
{

    public class DatabaseUnit(DatabaseContext context) : IDatabaseUnit, IDisposable
    {
        private readonly DatabaseContext _context = context;

        private bool _disposed = false;

        private TransactionScope? _scope = null;
        private bool _isTransactionActive = false;

        private readonly Lazy<IAsyncRepository<Organization>> _organization = new(() => new AsyncRepository<Organization>(context));
        private readonly Lazy<IAsyncRepository<Building>> _building = new(() => new AsyncRepository<Building>(context));
        private readonly Lazy<IAsyncRepository<Tower>> _tower = new(() => new AsyncRepository<Tower>(context));
        private readonly Lazy<IAsyncRepository<User>> _user = new(() => new AsyncRepository<User>(context));
        private readonly Lazy<IAsyncRepository<Category>> _category = new(() => new AsyncRepository<Category>(context));
        private readonly Lazy<IAsyncRepository<Equipment>> _equipment = new(() => new AsyncRepository<Equipment>(context));
        private readonly Lazy<IAsyncRepository<Labor>> _labor = new(() => new AsyncRepository<Labor>(context));
        private readonly Lazy<IAsyncRepository<Maintenance>> _maintenance = new(() => new AsyncRepository<Maintenance>(context));

        public IAsyncRepository<Organization> Organization => _organization.Value;
        public IAsyncRepository<Building> Building => _building.Value;
        public IAsyncRepository<Tower> Tower => _tower.Value;
        public IAsyncRepository<User> User => _user.Value;
        public IAsyncRepository<Category> Category => _category.Value;
        public IAsyncRepository<Equipment> Equipment => _equipment.Value;
        public IAsyncRepository<Labor> Labor => _labor.Value;
        public IAsyncRepository<Maintenance> Maintenance => _maintenance.Value;


        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                if (disposing)
                {
                    // Dispose managed state (managed objects).
                    _context?.Dispose();
                    _scope?.Dispose();
                }

                // Free unmanaged resources (unmanaged objects) and override finalizer.
                // Set large fields to null.

                _disposed = true;
            }
        }

        ~DatabaseUnit()
        {
            // Do not change this code. Put cleanup code in 'Dispose(bool disposing)' method
            Dispose(disposing: false);
        }

        public void Dispose()
        {
            DisposeTransactionScope();
            // Do not change this code. Put cleanup code in 'Dispose(bool disposing)' method
            Dispose(disposing: true);
            GC.SuppressFinalize(this);
        }

        private void ThrowIfDisposed()
        {
            if (!_disposed)
            {
                return;
            }
            throw new ObjectDisposedException(GetType().FullName);
        }

        public void StartTransaction()
        {
            var transactionOptions = new TransactionOptions
            {
                IsolationLevel = IsolationLevel.ReadCommitted,
                Timeout = TransactionManager.DefaultTimeout
            };

            _scope = new TransactionScope(TransactionScopeOption.Required, transactionOptions, TransactionScopeAsyncFlowOption.Enabled);
            _isTransactionActive = true;
        }

        public bool IsTransactionActive => _isTransactionActive;

        public async Task CommitTransaction(CancellationToken token)
        {
            ThrowIfDisposed();

            if (_isTransactionActive && _scope != null)
            {
                await SaveChangesAsync(token);
                _scope.Complete();
                _isTransactionActive = false;
            }
            // It's a good practice to dispose of the TransactionScope as soon as you're done with it.
            DisposeTransactionScope();
        }

        private void DisposeTransactionScope()
        {
            _scope?.Dispose();
            _scope = null;
        }


        public async Task SaveChangesAsync(CancellationToken token = default)
        {
            ThrowIfDisposed();
            await _context.SaveChangesAsync(token);
        }

    }

}
