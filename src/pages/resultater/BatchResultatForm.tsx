import React, { useState } from "react";
import { Resultat, Deltager, Disciplin } from "@/interfaces/interfaces";
import { createResultater } from "@/services/api/resultatapi";
import { Button } from "@/components/ui/button";
import InputField from "../../components/InputField";
import Modal from "../../components/Modal";
import { useToast } from "@/components/ui/use-toast";

interface BatchResultatFormProps {
  isOpen: boolean;
  onClose: () => void;
  deltagere: Deltager[];
  discipliner: Disciplin[];
  fetchResultater: () => void;
}

const BatchResultatForm: React.FC<BatchResultatFormProps> = ({ isOpen, onClose, deltagere, discipliner, fetchResultater }) => {
  const [batchResultater, setBatchResultater] = useState<Resultat[]>([]);
  const [selectedDisciplin, setSelectedDisciplin] = useState<number | null>(null);
  const [selectedDeltagere, setSelectedDeltagere] = useState<number[]>([]);
  const { toast } = useToast();

  const handleBatchInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log(`Input change at index ${index}: ${name} = ${value}`); // Log input changes
    setBatchResultater((prev) => {
      const newBatch = [...prev];
      newBatch[index] = { ...newBatch[index], [name]: value };
      return newBatch;
    });

    if (name === "deltagerId") {
      setSelectedDeltagere((prev) => {
        const newSelected = [...prev];
        newSelected[index] = parseInt(value);
        console.log(`Selected deltagere: ${newSelected}`); // Log selected deltagere
        return newSelected;
      });
    }
  };

  const addNewBatchResultat = () => {
    setBatchResultater((prev) => [
      ...prev,
      { deltagerId: 0, disciplinId: selectedDisciplin ?? 0, resultatType: "", dato: new Date(), resultatværdi: "" },
    ]);
    setSelectedDeltagere((prev) => [...prev, 0]);
  };

  const removeBatchResultat = (index: number) => {
    setBatchResultater((prev) => prev.filter((_, i) => i !== index));
  };

  const resetStates = () => {
    setBatchResultater([]);
    setSelectedDeltagere([]);
    setSelectedDisciplin(null);
  }

  const handleBatchFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createResultater(batchResultater);
      await fetchResultater();
      onClose();
      resetStates();
      toast({
        title: "Resultater oprettet",
        description: "Batch resultater er nu oprettet",
        variant: "default",
      });
    } catch (error) {
      console.error("Error creating batch results:", error);
      toast({
        title: "Fejl",
        description: "Der opstod en fejl under oprettelsen af batch resultater",
        variant: "destructive",
      });
    }
  };

  const setSelectedDisciplinAndUpdateBatch = (disciplinId: number) => {
    setSelectedDisciplin(disciplinId);
    setBatchResultater((prev) => prev.map((resultat) => ({ ...resultat, disciplinId })));
  };

  const filteredDeltagere = selectedDisciplin
  ? deltagere.filter((deltager) => {
      return deltager.discipliner.some((disciplin) => disciplin.id === selectedDisciplin);
    })
  : [];

  return (
    <Modal isOpen={isOpen} onClose={() => { onClose(); resetStates(); }} title="Batch Oprettelse af Resultater">
      <form onSubmit={handleBatchFormSubmit} className="space-y-4">
        <div>
          <label>Disciplin</label>
          <select
            value={selectedDisciplin ?? ""}
            onChange={(e) => setSelectedDisciplinAndUpdateBatch(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Vælg en disciplin</option>
            {discipliner &&
              discipliner.map((disciplin) => (
                <option key={disciplin.id} value={disciplin.id}>
                  {disciplin.navn}
                </option>
              ))}
          </select>
        </div>

        {batchResultater.map((resultat, index) => (
          <div key={index} className="space-y-2">
            <div>
              <label>Deltager</label>
              <select
                name="deltagerId"
                value={selectedDeltagere[index] ?? 0}
                onChange={(e) => handleBatchInputChange(index, e)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={0}>Vælg en deltager</option>
                {filteredDeltagere.map((deltager) => (
                  <option key={deltager.id} value={deltager.id}>
                    {deltager.navn}
                  </option>
                ))}
              </select>
            </div>

            <InputField
              label="Resultat Type"
              name="resultatType"
              value={resultat.resultatType}
              onChange={(e) => handleBatchInputChange(index, e)}
              placeholder="Indtast resultat type"
              required
            />

            <InputField
              label="Dato"
              name="dato"
              type="date"
              value={resultat.dato.toString()}
              onChange={(e) => handleBatchInputChange(index, e)}
              placeholder="Indtast dato"
              required
            />

            <InputField
              label="Resultat Værdi"
              name="resultatværdi"
              value={resultat.resultatværdi}
              onChange={(e) => handleBatchInputChange(index, e)}
              placeholder="Indtast resultat værdi"
              required
            />

            <Button onClick={() => removeBatchResultat(index)} variant="destructive" className="mt-2 py-1 px-3 rounded">
              Fjern
            </Button>
          </div>
        ))}
        <div className="flex flex-row justify-between">
        <Button type="submit" className="mt-4 py-2 px-4 rounded">
          Opret batch resultater
        </Button>
        
        <Button onClick={addNewBatchResultat} className="mt-4 py-2 px-4 rounded">
          Tilføj nyt resultat
        </Button>
        </div>
      </form>
    </Modal>
  );
};

export default BatchResultatForm;
