import React from "react";
import { Deltager } from "../../interfaces/interfaces";
import { Button } from "@/components/ui/button";

interface DeltagerListProps {
  deltagere: Deltager[];
  openModal: (type: "edit" | "delete", deltager?: Deltager) => void;
  openDeltagerDetails: (deltager: Deltager) => void;
}

const DeltagerList: React.FC<DeltagerListProps> = ({ deltagere, openModal, openDeltagerDetails }) => {
  return (
    <ul className="mt-6">
      {deltagere.map((deltager, index) => (
        <li
          key={deltager.id || index} // Use index to ensure there's a unique key
          className="flex justify-between items-center bg-white shadow px-4 py-2 rounded-lg mt-2"
        >
          <span onClick={() => openDeltagerDetails(deltager)} className="font-medium text-gray-800 hover:underline cursor-pointer">
            {deltager.navn}
          </span>
          <div>
            <Button onClick={() => openModal("edit", deltager)} variant="secondary" className="py-1 px-3 rounded mr-2 hover:bg-gray-200">
              Rediger
            </Button>
            <Button onClick={() => openModal("delete", deltager)} variant="secondary" className="py-1 px-3 rounded hover:bg-gray-200">
              Slet
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default DeltagerList;