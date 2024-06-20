import { useState } from "react";

interface SearchBarProps {
    onSearch: (searchTerm: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = () => {
        onSearch(searchTerm);
    };

    return (
        <div className="flex">
          <input className="px-3 py-2 border border-gray-300 shadow-sm rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products by name..."
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch}
          className="px-3 py-2 bg-blue-500 text-white font-bold hover:bg-blue-700 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >Search</button>
        </div>
      );
}

