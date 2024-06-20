import { useEffect, useState } from "react";
import {
  getResultater,
  getResultaterByDisciplin,
  createResultat,
  //createResultater,
  updateResultat,
  deleteResultat,
} from "../../services/api/resultatapi";
import { getDeltagere } from "../../services/api/deltagerapi";
import { getDiscipliner } from "../../services/api/disciplinapi";
import Modal from "../../components/Modal";
import InputField from "../../components/InputField";
import { Resultat, Deltager, Disciplin } from "../../interfaces/interfaces";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export function ResultatManager() {
  const [resultater, setResultater] = useState<Resultat[]>([]);
  const [deltagere, setDeltagere] = useState<Deltager[]>([]);
  const [discipliner, setDiscipliner] = useState<Disciplin[]>([]);
  const [selectedResultat, setSelectedResultat] = useState<Resultat | null>(null);
  const [selectedDisciplin, setSelectedDisciplin] = useState<string>("");
  const [selectedDeltager, setSelectedDeltager] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"create" | "edit" | "delete">("create");
  const [filterKøn, setFilterKøn] = useState<string>("");
  const [filterMinAlder, setFilterMinAlder] = useState<number | null>(null);
  const [filterMaxAlder, setFilterMaxAlder] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchResultater();
    fetchDeltagere();
    fetchDiscipliner();
  }, []);

  const fetchResultater = async () => {
    const response = await getResultater();
    setResultater(response.data);
  };

  const fetchDeltagere = async () => {
    const response = await getDeltagere();
    setDeltagere(response.data);
  };

  const fetchDiscipliner = async () => {
    const response = await getDiscipliner();
    setDiscipliner(response.data);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedResultat) {
      if (modalType === "edit" && selectedResultat.id) {
        await updateResultat(selectedResultat.id, selectedResultat);
      } else if (modalType === "create") {
        await createResultat(selectedResultat);
      }
      await fetchResultater();
      setIsModalOpen(false);
      toast({
        title: modalType === "create" ? "Resultat oprettet" : "Resultat opdateret",
        description: modalType === "create" ? "Resultat er nu oprettet" : "Resultat er nu opdateret",
        variant: "default",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSelectedResultat((prev) => {
      if (prev === null) {
        const newResultat: Resultat = {
          disciplinId: parseInt(selectedDisciplin),
          deltagerId: parseInt(selectedDeltager),
          resultatType: "",
          dato: new Date(),
          resultatværdi: "",
          [name]: value,
        };
        return newResultat;
      } else {
        return { ...prev, [name]: value };
      }
    });
  };

  const openModal = (type: "create" | "edit" | "delete", resultat?: Resultat) => {
    setModalType(type);
    setSelectedResultat(resultat || null);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedResultat && selectedResultat.id) {
      await deleteResultat(selectedResultat.id);
      fetchResultater();
      setIsModalOpen(false);
      toast({
        title: "Resultat slettet",
        description: `Resultat er nu slettet`,
        variant: "destructive",
      });
    }
  };

  const handleFilterChange = async () => {
    const disciplinId = parseInt(selectedDisciplin, 10);
    const minAlder = filterMinAlder !== null ? parseInt(filterMinAlder.toString(), 10) : undefined;
    const maxAlder = filterMaxAlder !== null ? parseInt(filterMaxAlder.toString(), 10) : undefined;
    
    const response = await getResultaterByDisciplin(disciplinId, filterKøn, minAlder, maxAlder);
    setResultater(response.data);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold leading-tight text-gray-900">Administration af Resultater</h1>
      <Button onClick={() => openModal("create")} className="mt-4 py-2 px-4 rounded">
        Tilføj nyt resultat
      </Button>

      <div className="mt-4">
        <label>Filter Disciplin</label>
        <select
          value={selectedDisciplin}
          onChange={(e) => setSelectedDisciplin(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Vælg en disciplin</option>
          {discipliner.map((disciplin) => (
            <option key={disciplin.id} value={disciplin.id}>
              {disciplin.navn}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <label>Filter Køn</label>
        <select
          value={filterKøn}
          onChange={(e) => setFilterKøn(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Vælg køn</option>
          <option value="male">Mand</option>
          <option value="female">Kvinde</option>
        </select>
      </div>

      <div className="mt-4">
        <label>Filter Min Alder</label>
        <input
          type="number"
          value={filterMinAlder ?? ""}
          onChange={(e) => setFilterMinAlder(e.target.value ? parseInt(e.target.value) : null)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Indtast minimum alder"
        />
      </div>

      <div className="mt-4">
        <label>Filter Max Alder</label>
        <input
          type="number"
          value={filterMaxAlder ?? ""}
          onChange={(e) => setFilterMaxAlder(e.target.value ? parseInt(e.target.value) : null)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Indtast maksimum alder"
        />
      </div>

      <Button onClick={handleFilterChange} className="mt-4 py-2 px-4 rounded">
        Anvend filter
      </Button>

      <ul className="mt-6">
        {resultater.map((resultat) => {
          const deltager = deltagere.find((d) => d.id === resultat.deltagerId);
          const disciplin = discipliner.find((d) => d.id === resultat.disciplinId);
          return (
            <li key={resultat.id} className="flex justify-between items-center bg-white shadow px-4 py-2 rounded-lg mt-2">
              <div className="flex flex-col">
                <span className="font-medium text-gray-800">
                  Navn: <span className="font-normal">{deltager?.navn}</span>
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
        })}
      </ul>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`${modalType.charAt(0).toUpperCase() + modalType.slice(1)} Resultat`}>
        {modalType !== "delete" ? (
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label>Deltager</label>
              <select
                value={selectedDeltager}
                onChange={(e) => setSelectedDeltager(e.target.value)}
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
                {discipliner.map((disciplin) => (
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
        ) : (
          <div>
            <p className="text-lg mb-4">Er du sikker på at du vil slette dette resultat?</p>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h2 className="text-gray-800 font-semibold">
                <span className="text-blue-600">
                  {deltagere.find((d) => d.id === selectedResultat?.deltagerId)?.navn} -{" "}
                  {discipliner.find((d) => d.id === selectedResultat?.disciplinId)?.navn}
                </span>
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
