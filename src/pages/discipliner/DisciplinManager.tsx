import { useEffect, useState } from "react";
import { getDiscipliner, createDisciplin, updateDisciplin, deleteDisciplin } from "../../services/api/disciplinapi";
import Modal from "../../components/Modal";
import DisciplinForm from "./DisciplinForm";
import DisciplinList from "./DisciplinList";
import { Disciplin } from "../../interfaces/interfaces";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export function DisciplinManager() {
  const [discipliner, setDiscipliner] = useState<Disciplin[]>([]);
  const [selectedDisciplin, setSelectedDisciplin] = useState<Disciplin | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"create" | "edit" | "delete">("create");
  const { toast } = useToast();

  useEffect(() => {
    fetchDiscipliner();
  }, []);

  const fetchDiscipliner = async () => {
    const response = await getDiscipliner();
    setDiscipliner(response.data);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDisciplin) {
      if (modalType === "edit" && selectedDisciplin.id) {
        await updateDisciplin(selectedDisciplin.id, selectedDisciplin);
      } else if (modalType === "create") {
        await createDisciplin(selectedDisciplin);
      }
      await fetchDiscipliner();
      setIsModalOpen(false);
      toast({
        title: modalType === "create" ? "Disciplin oprettet" : "Disciplin opdateret",
        description: modalType === "create" ? "Disciplin er nu oprettet" : "Disciplin er nu opdateret",
        variant: "default",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSelectedDisciplin(prev => {
      if (prev === null) {
        const newDisciplin: Disciplin = {
          navn: "",
          resultatType: "",
          [name]: value,
        };
        return newDisciplin;
      } else {
        return { ...prev, [name]: value };
      }
    });
  };

  const openModal = (type: "create" | "edit" | "delete", disciplin?: Disciplin) => {
    setModalType(type);
    setSelectedDisciplin(disciplin || null);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedDisciplin && selectedDisciplin.id) {
      await deleteDisciplin(selectedDisciplin.id);
      fetchDiscipliner();
      setIsModalOpen(false);
      toast({
        title: "Disciplin slettet",
        description: `${selectedDisciplin.navn} er nu slettet`,
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold leading-tight text-gray-900">Discipliner</h1>
      <Button onClick={() => openModal("create")} className="mt-4 py-2 px-4 rounded">
        Tilføj ny disciplin
      </Button>

      <DisciplinList discipliner={discipliner} openModal={openModal} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`${modalType.charAt(0).toUpperCase() + modalType.slice(1)} Disciplin`}>
        {modalType !== "delete" ? (
          <DisciplinForm
            selectedDisciplin={selectedDisciplin}
            modalType={modalType}
            handleInputChange={handleInputChange}
            handleFormSubmit={handleFormSubmit}
          />
        ) : (
          <div>
            <p className="text-lg mb-4">Er du sikker på at du vil slette denne disciplin?</p>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h2 className="text-gray-800 font-semibold">
                <span className="text-blue-600">{selectedDisciplin?.navn}</span>
              </h2>
            </div>
            <div className="flex justify-end items-center p-4 mt-4 border-t border-gray-200">
              <Button onClick={handleDelete} variant="destructive" className="py-2 px-4 rounded-l">
                Ja, slet
              </Button>
              <Button onClick={() => setIsModalOpen(false)} variant="secondary" className="py-2 px-4 rounded-r ml-2 hover:bg-gray-200">
                Nej, gå tilbage
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}