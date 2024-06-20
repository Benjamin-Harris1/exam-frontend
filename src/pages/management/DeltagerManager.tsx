import { useEffect, useState } from "react";
import { getDeltagere, createDeltager, updateDeltager, deleteDeltager } from "../../services/api/deltagerapi";
import { getDiscipliner } from "../../services/api/disciplinapi";
import Modal from "../../components/Modal";
import InputField from "../../components/InputField";
import { Deltager, Disciplin } from "../../interfaces/interfaces";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export function DeltagerManager() {
  const [deltagere, setDeltagere] = useState<Deltager[]>([]);
  const [discipliner, setDiscipliner] = useState<Disciplin[]>([]);
  const [selectedDeltager, setSelectedDeltager] = useState<Deltager | null>(null);
  const [selectedDisciplin, setSelectedDisciplin] = useState<Disciplin[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"create" | "edit" | "delete">(
    "create"
  );
  const {toast} = useToast();

  useEffect(() => {
    fetchDeltagere();
    fetchDiscipliner();
    
  }, []);

  const fetchDeltagere = async () => {
    const response = await getDeltagere();
    setDeltagere(response.data);
    
  };

  const fetchDiscipliner = async () => {
    const response = await getDiscipliner();
    setDiscipliner(response.data);
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDeltager) {
      if (modalType === "edit" && selectedDeltager.id) {
        await updateDeltager(selectedDeltager.id, selectedDeltager);
      } else if (modalType === "create") {
        await createDeltager(selectedDeltager);
      }
      await fetchDeltagere();
      setIsModalOpen(false);
      toast({
        title: modalType === "create" ? "Deltager oprettet" : "Deltager opdateret",
        description: modalType === "create" ? "Deltager er nu oprettet" : "Deltager er nu opdateret",
        variant: "default",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSelectedDeltager(prev => {
    // if null, create new product object with default values and the updated field to satisfy TS...
      if (prev === null) {
        const newDeltager: Deltager = {
          navn: "",
          køn: "",
          alder: 0,
          klub: "",
          discipliner: selectedDisciplin, 
          [name]: value,
        };
        return newDeltager;
      } else {
        return { ...prev, [name]: value, discipliner: selectedDisciplin }; 
      }
    });
  };

  const openModal = (type: "create" | "edit" | "delete", deltager?: Deltager) => {
    setModalType(type);
    setSelectedDeltager(deltager || null);
    setIsModalOpen(true);
  
    if (deltager) {
      setSelectedDisciplin(deltager.discipliner);
    } else {
      setSelectedDisciplin([]);
    }
  };

  const handleDelete = async () => {
    if (selectedDeltager && selectedDeltager.id) {
      await deleteDeltager(selectedDeltager.id);
      fetchDeltagere();
      setIsModalOpen(false);
      toast({
        title: "Deltager slettet",
        description: `${selectedDeltager.navn} er nu slettet`,
        variant: "destructive",
      });
    }
  };

  const handleDisciplinChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    const selectedDiscipliner = discipliner.filter(disciplin => selectedOptions.includes(disciplin.navn));
    // Update selectedDisciplin state
    setSelectedDisciplin(selectedDiscipliner); 
    setSelectedDeltager(prev => {
      if (prev === null) {
        return null;
      } else {
        return { ...prev, discipliner: selectedDiscipliner };
      }
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold leading-tight text-gray-900">
        Administration
      </h1>
      <Button
        onClick={() => openModal("create")}
        className="mt-4 py-2 px-4 rounded"
      >
        Tilføj ny deltager
      </Button>

      <ul className="mt-6">
        {deltagere.map(deltager => (
          <li
            key={deltager.id}
            className="flex justify-between items-center bg-white shadow px-4 py-2 rounded-lg mt-2"
          >
            <span className="font-medium text-gray-800">
                {deltager.navn}
            </span>
            <div>
              <Button
                onClick={() => openModal("edit", deltager)}
                variant="secondary"
                className="py-1 px-3 rounded mr-2 hover:bg-gray-200"
              >
                Rediger
              </Button>
              <Button
                onClick={() => openModal("delete", deltager)}
                variant="secondary"
                className="py-1 px-3 rounded hover:bg-gray-200"
              >
                Slet
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${
          modalType.charAt(0).toUpperCase() + modalType.slice(1)
        } Deltager`}
      >
        {modalType !== "delete" ? (
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
                value={selectedDisciplin?.map(d => d.navn) ?? []}
                onChange={handleDisciplinChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Vælg en disciplin</option>
                {discipliner.map(disciplin => (
                  <option key={disciplin.id} value={disciplin.navn}>
                    {disciplin.navn}
                  </option>
                ))}
              </select>
            </div>

            <Button
              type="submit"
              className="mt-4 py-2 px-4 rounded"
            >
              {modalType === "create" ? "Opret deltager" : "Gem ændringer"}
            </Button>
          </form>
        ) : (
          <div>
            <p className="text-lg mb-4">
              Er du sikker på at du vil slette denne deltager?
            </p>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h2 className="text-gray-800 font-semibold">
                <span className="text-blue-600">{selectedDeltager?.navn}</span>
              </h2>
            </div>
            <div className="flex justify-end items-center p-4 mt-4 border-t border-gray-200">
              <Button
                onClick={handleDelete}
                variant="destructive"
                className=" py-2 px-4 rounded-l"
              >
                Ja, slet
              </Button>
              <Button
                onClick={() => setIsModalOpen(false)}
                variant="secondary"
                className=" py-2 px-4 rounded-r ml-2 hover:bg-gray-200"
              >
                Nej, gå tilbage
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
