using Microsoft.EntityFrameworkCore.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public interface ISpecification<T>
    {
        Expression<Func<T, bool>> Criteria { get; }
        List<Expression<Func<T, object>>> Includes { get; }
        List<Func<IQueryable<T>, IIncludableQueryable<T, object>>> IncludeAggregates { get; }
        Func<IQueryable<T>, IOrderedQueryable<T>> OrderBy { get; }
        Func<IQueryable<T>, IOrderedQueryable<T>> OrderByDescending { get; }

        void AddInclude(Expression<Func<T, object>> includeExpression);
        void AddIncludeAggregate(Func<IQueryable<T>, IIncludableQueryable<T, object>> includeAggregate);
        void ApplyOrderBy(Expression<Func<T, object>> orderByExpression);
        void ApplyOrderByDescending(Expression<Func<T, object>> orderByDescendingExpression);
    }

}
