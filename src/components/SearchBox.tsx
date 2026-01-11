export const SearchBox = () => {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search artists, tags..."
        className="w-56 pl-3 pr-9 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
        🔍
      </div>
    </div>
  );
};

