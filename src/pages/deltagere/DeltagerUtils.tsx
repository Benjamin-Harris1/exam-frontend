import React from "react";

interface SortButtonProps {
  label: string;
  sortOrder: string;
  onClick: () => void;
}

const AscendingIcon = () => (
  <svg width="16" height="16" fill="currentColor" className="bi bi-sort-up" viewBox="0 0 16 16">
    <path d="M3.5 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1h-8a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"/>
  </svg>
);

const DescendingIcon = () => (
  <svg width="16" height="16" fill="currentColor" className="bi bi-sort-down" viewBox="0 0 16 16">
    <path d="M3.5 3.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1h-8a.5.5 0 0 1-.5-.5z"/>
  </svg>
);

const SortButton: React.FC<SortButtonProps> = ({ label, sortOrder, onClick }) => {
  return (
    <button onClick={onClick} className="p-2 bg-gray-200 rounded flex items-center">
      {sortOrder === "asc" ? <AscendingIcon /> : <DescendingIcon />}
      <span className="ml-1">{label}</span>
    </button>
  );
};

export default SortButton;