import React from "react";
import { Disciplin } from "../../interfaces/interfaces";
import InputField from "../../components/InputField";
import { Button } from "@/components/ui/button";

interface DisciplinFormProps {
  selectedDisciplin: Disciplin | null;
  modalType: "create" | "edit";
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFormSubmit: (e: React.FormEvent) => void;
}

const DisciplinForm: React.FC<DisciplinFormProps> = ({
  selectedDisciplin,
  modalType,
  handleInputChange,
  handleFormSubmit,
}) => {
  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <InputField
        label="Navn"
        name="navn"
        value={selectedDisciplin?.navn ?? ""}
        onChange={handleInputChange}
        placeholder="Disciplin navn"
        required
      />
      <InputField
        label="Resultat Type"
        name="resultatType"
        value={selectedDisciplin?.resultatType ?? ""}
        onChange={handleInputChange}
        placeholder="Resultat Type"
        required
      />
      <Button type="submit" className="mt-4 py-2 px-4 rounded">
        {modalType === "create" ? "Opret disciplin" : "Gem ændringer"}
      </Button>
    </form>
  );
};

export default DisciplinForm;