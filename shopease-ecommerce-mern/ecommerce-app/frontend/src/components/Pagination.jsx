const Pagination = ({ page, pages, onChange }) => {
  if (pages <= 1) return null;

  const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1);

  return (
    <nav className="mt-8 flex items-center justify-center gap-1" aria-label="Pagination">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-teal-50 disabled:opacity-40"
      >
        Prev
      </button>

      {pageNumbers.map((num) => (
        <button
          key={num}
          type="button"
          onClick={() => onChange(num)}
          aria-current={num === page ? 'page' : undefined}
          className={`h-9 w-9 rounded-lg text-sm font-medium transition ${
            num === page ? 'bg-teal text-white' : 'text-gray-600 hover:bg-teal-50'
          }`}
        >
          {num}
        </button>
      ))}

      <button
        type="button"
        disabled={page === pages}
        onClick={() => onChange(page + 1)}
        className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-teal-50 disabled:opacity-40"
      >
        Next
      </button>
    </nav>
  );
};

export default Pagination;
