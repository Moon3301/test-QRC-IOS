using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;

namespace Domain
{

    public abstract class Specification<T> : ISpecification<T>
    {
        public Expression<Func<T, bool>> Criteria { get; }
        public List<Expression<Func<T, object>>> Includes { get; } = [];
        public List<Func<IQueryable<T>, IIncludableQueryable<T, object>>> IncludeAggregates { get; } = [];
        public Func<IQueryable<T>, IOrderedQueryable<T>> OrderBy { get; private set; }
        public Func<IQueryable<T>, IOrderedQueryable<T>> OrderByDescending { get; private set; }

        protected Specification(Expression<Func<T, bool>> criteria)
        {
            Criteria = criteria;
        }

        public void AddInclude(Expression<Func<T, object>> includeExpression)
        {
            Includes.Add(includeExpression);
        }

        

        public void AddIncludeAggregate(Func<IQueryable<T>, IIncludableQueryable<T, object>> includeAggregate)
        {
            IncludeAggregates.Add(includeAggregate);
        }

        public void ApplyOrderBy(Expression<Func<T, object>> orderByExpression)
        {
            OrderBy = q => q.OrderBy(orderByExpression);
        }

        public void ApplyOrderByDescending(Expression<Func<T, object>> orderByDescendingExpression)
        {
            OrderByDescending = q => q.OrderByDescending(orderByDescendingExpression);
        }
    }


    public class SpecificationEvaluator<T> where T : class
    {
        public static IQueryable<T> GetQuery(IQueryable<T> inputQuery, ISpecification<T> spec)
        {
            var query = inputQuery;

            if (spec.Criteria != null)
            {
                query = query.Where(spec.Criteria);
            }

            if (spec.Includes != null && spec.Includes.Count != 0)
            {
                foreach (var include in spec.Includes)
                {
                    query = query.Include(include);
                }
            }

            if (spec.IncludeAggregates != null && spec.IncludeAggregates.Count != 0)
            {
                foreach (var includeAggregate in spec.IncludeAggregates)
                {
                    query = includeAggregate(query);
                }
            }

            if (spec.OrderBy != null)
            {
                query = spec.OrderBy(query);
            }
            else if (spec.OrderByDescending != null)
            {
                query = spec.OrderByDescending(query);
            }

            return query;
        }
    }

}