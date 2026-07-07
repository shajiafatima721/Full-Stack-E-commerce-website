const CategoryFilter = ({ categories = [], active = 'all', onSelect }) => {
  const allOptions = ['all', ...categories];

  return (
    <div className="flex flex-wrap gap-2">
      {allOptions.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onSelect(cat)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition ${
            active === cat
              ? 'bg-teal text-white'
              : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-teal-50'
          }`}
        >
          {cat === 'all' ? 'All categories' : cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
