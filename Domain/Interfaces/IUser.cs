


namespace Domain.Interfaces
{
    public interface IUserService
    {
        Task<IReadOnlyCollection<UserCredential>> Collection(int organizationId, Position position = Position.Tecnico);
        Task<IEnumerable<AutocompleteItem>> Autocomplete(string search, CancellationToken token);
		Task<UserCredential> ReadCredential(string user, CancellationToken token = default);
		Task<IList<UserCredential>> ReadRelated(int organization, CancellationToken token = default);
        Task<IList<UserCredential>> ReadAll(CancellationToken token = default);
    }
}
