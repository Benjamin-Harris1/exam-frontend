import React from "react";
import { Deltager, Disciplin, Resultat } from "../../interfaces/interfaces";
import InputField from "../../components/InputField";
import { Button } from "@/components/ui/button";

interface ResultatFormProps {
  selectedResultat: Resultat | null;
  selectedDeltager: string;
  selectedDisciplin: string;
  deltagere: Deltager[];
  discipliner: Disciplin[];
  filteredDiscipliner: Disciplin[];
  modalType: "create" | "edit" | "delete" | "batch";
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleDeltagerChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleFormSubmit: (e: React.FormEvent) => void;
  setSelectedDisciplin: (value: string) => void;
}

const ResultatForm: React.FC<ResultatFormProps> = ({
  selectedResultat,
  selectedDeltager,
  selectedDisciplin,
  deltagere,
  filteredDiscipliner,
  modalType,
  handleInputChange,
  handleDeltagerChange,
  handleFormSubmit,
  setSelectedDisciplin,
}) => {
  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <div>
        <label>Deltager</label>
        <select
          value={selectedDeltager}
          onChange={handleDeltagerChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Vælg en deltager</option>
          {deltagere.map((deltager) => (
            <option key={deltager.id} value={deltager.id}>
              {deltager.navn}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Disciplin</label>
        <select
          value={selectedDisciplin}
          onChange={(e) => setSelectedDisciplin(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Vælg en disciplin</option>
          {filteredDiscipliner.map((disciplin) => (
            <option key={disciplin.id} value={disciplin.id}>
              {disciplin.navn}
            </option>
          ))}
        </select>
      </div>

      <InputField
        label="Resultat Type"
        name="resultatType"
        value={selectedResultat?.resultatType ?? ""}
        onChange={handleInputChange}
        placeholder="Indtast resultat type"
        required
      />

      <InputField
        label="Dato"
        name="dato"
        type="date"
        value={selectedResultat?.dato.toString() ?? ""}
        onChange={handleInputChange}
        placeholder="Indtast dato"
        required
      />

      <InputField
        label="Resultat Værdi"
        name="resultatværdi"
        value={selectedResultat?.resultatværdi ?? ""}
        onChange={handleInputChange}
        placeholder="Indtast resultat værdi"
        required
      />

      <Button type="submit" className="mt-4 py-2 px-4 rounded">
        {modalType === "create" ? "Opret resultat" : "Gem ændringer"}
      </Button>
    </form>
  );
};

export default ResultatForm;