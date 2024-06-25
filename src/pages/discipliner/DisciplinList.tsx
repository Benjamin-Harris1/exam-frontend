import React from "react";
import { Disciplin } from "../../interfaces/interfaces";
import { Button } from "@/components/ui/button";

interface DisciplinListProps {
  discipliner: Disciplin[];
  openModal: (type: "edit" | "delete", disciplin?: Disciplin) => void;
}

const DisciplinList: React.FC<DisciplinListProps> = ({ discipliner, openModal }) => {
  return (
    <ul className="mt-6">
      {discipliner.map((disciplin) => (
        <li
          key={disciplin.id}
          className="flex justify-between items-center bg-white shadow px-4 py-2 rounded-lg mt-2"
        >
          <span className="font-medium text-gray-800">{disciplin.navn}</span>
          <div>
            <Button
              onClick={() => openModal("edit", disciplin)}
              variant="secondary"
              className="py-1 px-3 rounded mr-2 hover:bg-gray-200"
            >
              Rediger
            </Button>
            <Button
              onClick={() => openModal("delete", disciplin)}
              variant="secondary"
              className="py-1 px-3 rounded hover:bg-gray-200"
            >
              Slet
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default DisciplinList;