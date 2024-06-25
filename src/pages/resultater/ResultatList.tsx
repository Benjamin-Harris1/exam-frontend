import React from "react";
import { Resultat, Deltager, Disciplin } from "../../interfaces/interfaces";
import { Button } from "@/components/ui/button";

interface ResultatListProps {
  resultater: Resultat[];
  deltagere: Deltager[];
  discipliner: Disciplin[];
  openModal: (type: "edit" | "delete", resultat: Resultat) => void;
}

const ResultatList: React.FC<ResultatListProps> = ({ resultater, deltagere, discipliner, openModal }) => {
  return (
    <ul className="mt-6">
      {resultater && resultater.length > 0 ? (
        resultater.map((resultat) => {
          const deltager = deltagere.find((d) => d.id === resultat.deltagerId);
          const disciplin = discipliner.find((d) => d.id === resultat.disciplinId);
          return (
            <li key={resultat.id} className="flex justify-between items-center bg-white shadow px-4 py-2 rounded-lg mt-2">
              <div className="flex flex-col">
                <span className="font-medium text-gray-800">
                  Navn: <span className="font-normal">{deltager?.navn}</span>
                </span>
                <span className="font-medium text-gray-800">
                  Alder: <span className="font-normal">{deltager?.alder}</span>
                </span>
                <span className="font-medium text-gray-800">
                  Dato: <span className="font-normal">{new Intl.DateTimeFormat('da-DK', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  }).format(new Date(resultat.dato))}</span>
                </span>
                <span className="font-medium text-gray-800">
                  Disciplin: <span className="font-normal">{disciplin?.navn}</span>
                </span>
                <span className="font-medium text-gray-800">
                  Resultat: <span className="font-normal">{resultat.resultatværdi}</span>
                </span>
              </div>
              <div>
                <Button onClick={() => openModal("edit", resultat)} variant="secondary" className="py-1 px-3 rounded mr-2 hover:bg-gray-200">
                  Rediger
                </Button>
                <Button onClick={() => openModal("delete", resultat)} variant="secondary" className="py-1 px-3 rounded hover:bg-gray-200">
                  Slet
                </Button>
              </div>
            </li>
          );
        })
      ) : (
        <li>Ingen resultater fundet</li>
      )}
    </ul>
  );
};

export default ResultatList;