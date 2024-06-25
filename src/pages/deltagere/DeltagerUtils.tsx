import React from "react";

interface SortButtonProps {
  label: string;
  sortOrder: string;
  onClick: () => void;
}

const SortButton: React.FC<SortButtonProps> = ({ label, sortOrder, onClick }) => {
  return (
    <button onClick={onClick} className="py-2 px-4 rounded">
      {label} {sortOrder === "asc" ? "↑" : sortOrder === "desc" ? "↓" : ""}
    </button>
  );
};

export default SortButton;