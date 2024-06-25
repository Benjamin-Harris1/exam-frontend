import React from "react";
import { Deltager, Disciplin } from "../../interfaces/interfaces";
import InputField from "../../components/InputField";
import { Button } from "@/components/ui/button";

interface DeltagerFormProps {
  selectedDeltager: Deltager | null;
  selectedDisciplin: Disciplin[];
  discipliner: Disciplin[];
  modalType: "create" | "edit";
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDisciplinChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleFormSubmit: (e: React.FormEvent) => void;
}

const DeltagerForm: React.FC<DeltagerFormProps> = ({
  selectedDeltager,
  selectedDisciplin,
  discipliner,
  modalType,
  handleInputChange,
  handleDisciplinChange,
  handleFormSubmit,
}) => {
  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <InputField
        label="Navn"
        name="navn"
        value={selectedDeltager?.navn ?? ""}
        onChange={handleInputChange}
        placeholder="Deltager navn"
        required
      />
      <InputField
        label="Køn"
        name="køn"
        value={selectedDeltager?.køn ?? ""}
        onChange={handleInputChange}
        placeholder="Køn"
        required
      />
      <InputField
        label="Alder"
        name="alder"
        value={selectedDeltager?.alder ?? ""}
        onChange={handleInputChange}
        placeholder="Alder"
        required
      />
      <InputField
        label="Klub"
        name="klub"
        value={selectedDeltager?.klub ?? ""}
        onChange={handleInputChange}
        placeholder="Klub"
      />
      <div>
        <label>Disciplin</label>
        <select
          multiple
          value={selectedDisciplin?.map((d) => d.navn) ?? []}
          onChange={handleDisciplinChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Vælg en disciplin</option>
          {discipliner.map((disciplin) => (
            <option key={disciplin.id} value={disciplin.navn}>
              {disciplin.navn}
            </option>
          ))}
        </select>
      </div>
      <Button type="submit" className="mt-4 py-2 px-4 rounded">
        {modalType === "create" ? "Opret deltager" : "Gem ændringer"}
      </Button>
    </form>
  );
};

export default DeltagerForm;