const Loader = ({ label = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-500">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-100 border-t-teal" />
    <p className="text-sm">{label}</p>
  </div>
);

export default Loader;
