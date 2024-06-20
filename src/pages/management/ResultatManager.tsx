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
  const [filteredDiscipliner, setFilteredDiscipliner] = useState<Disciplin[]>([]);
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

    if (type === "create") {
      setSelectedDisciplin("");
      setSelectedDeltager("");
      setFilteredDiscipliner([]);
    } else if (resultat) {
      const selectedDeltager = deltagere.find((d) => d.id === resultat.deltagerId);
      if (selectedDeltager) {
        setFilteredDiscipliner(selectedDeltager.discipliner);
        setSelectedDisciplin(resultat.disciplinId.toString());
        setSelectedDeltager(resultat.deltagerId.toString());
      }
    }
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

  const handleFilterChange = async (disciplinIdStr?: string, køn?: string, minAlder?: number, maxAlder?: number) => {
    const disciplinId = disciplinIdStr ? parseInt(disciplinIdStr, 10) : NaN;
    if (isNaN(disciplinId)) {
      // If no discipline is selected, fetch all results
      await fetchResultater();
      return;
    }
  
    // Log the parameters
    console.log("Filter parameters:", {
      disciplinId,
      køn,
      minAlder,
      maxAlder,
    });
  
    try {
      const response = await getResultaterByDisciplin(disciplinId, køn || undefined, minAlder || undefined, maxAlder || undefined);
      setResultater(response);
    } catch (error) {
      console.error("Error fetching filtered results:", error);
      setResultater([]); // Set to empty array on error
    }
  };

  const handleKønChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilterKøn(value);
    handleFilterChange(selectedDisciplin, value, filterMinAlder ?? undefined, filterMaxAlder ?? undefined);
  };
  
  const handleAlderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [min, max] = e.target.value.split('-').map(v => v === "null" ? null : parseInt(v));
    setFilterMinAlder(min);
    setFilterMaxAlder(max);
    handleFilterChange(selectedDisciplin, filterKøn, min ?? undefined, max ?? undefined);
  };

  const handleDeltagerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDeltagerId = parseInt(e.target.value);
    setSelectedDeltager(e.target.value);

    const selectedDeltager = deltagere.find((d) => d.id === selectedDeltagerId);
    if (selectedDeltager) {
      setFilteredDiscipliner(selectedDeltager.discipliner);
      if (selectedDeltager.discipliner.length > 0) {
        setSelectedDisciplin(selectedDeltager.discipliner[0].id?.toString() || "");
      } else {
        setSelectedDisciplin("");
      }
    } else {
      setFilteredDiscipliner([]);
      setSelectedDisciplin("");
    }
  };

  const handleDisciplinChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    console.log("Selected Disciplin ID:", value); // Debugging log
    setSelectedDisciplin(value);
    await handleFilterChange(value);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold leading-tight text-gray-9000">Administration af Resultater</h1>

      <div className="flex flex-row justify-between">
      <Button onClick={() => openModal("create")} className="mt-4 py-2 px-4 rounded">
        Tilfj nyt resultat
      </Button>
      <Button className="mt-4 py-2 px-4 rounded">
        Tilfjer nye resultater
      </Button>
      </div>

      <div className="mt-4">
      <label>Filtrer Disciplin</label>
      <select
        value={selectedDisciplin}
        onChange={handleDisciplinChange}
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

      {selectedDisciplin && (
        <div className="mt-4 flex space-x-4">
        <div>
          <label>Filtrér Køn</label>
          <select
            value={filterKøn}
            onChange={handleKønChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Alle</option>
            <option value="mand">Mand</option>
            <option value="kvinde">Kvinde</option>
          </select>
        </div>

        <div>
          <label>Filtrér Alder</label>
          <select
            value={`${filterMinAlder}-${filterMaxAlder}`}
            onChange={handleAlderChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Alle</option>
            <option value="6-9">Børn (6-9)</option>
            <option value="10-13">Unge (10-13)</option>
            <option value="14-22">Junior (14-22)</option>
            <option value="23-40">Voksne (23-40)</option>
            <option value="41-150">Senior (41-)</option>
          </select>
        </div>
      </div>
      )}

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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`${modalType.charAt(0).toUpperCase() + modalType.slice(1)} Resultat`}>
        {modalType !== "delete" ? (
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