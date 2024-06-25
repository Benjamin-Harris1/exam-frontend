import { useEffect, useState } from "react";
import {
  getDeltagere,
  createDeltager,
  updateDeltager,
  deleteDeltager,
  getDeltagerByName,
  getFilteredDeltagere,
} from "../../services/api/deltagerapi";
import { getDiscipliner } from "../../services/api/disciplinapi";
import Modal from "../../components/Modal";
import DeltagerForm from "./DeltagerForm";
import { Deltager, Disciplin } from "../../interfaces/interfaces";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import SearchBar from "@/components/SearchBar";
import DeltagerDetails from "./DeltagerDetails";
import DeltagerList from "./DeltagerList";
import SortButton from "./DeltagerUtils";

export function DeltagerManager() {
  const [deltagere, setDeltagere] = useState<Deltager[]>([]);
  const [discipliner, setDiscipliner] = useState<Disciplin[]>([]);
  const [selectedDeltager, setSelectedDeltager] = useState<Deltager | null>(null);
  const [selectedDisciplin, setSelectedDisciplin] = useState<Disciplin[]>([]);
  const [filterKøn, setFilterKøn] = useState<string>("");
  const [filterMinAlder, setFilterMinAlder] = useState<number | null>(null);
  const [filterMaxAlder, setFilterMaxAlder] = useState<number | null>(null);
  const [filterKlub, setFilterKlub] = useState<string>("");
  const [filterDisciplin, setFilterDisciplin] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"create" | "edit" | "delete" | "details">("create");
  const { toast } = useToast();

  // Sorting
  const [sortKøn, setSortKøn] = useState<string>("");
  const [sortAlder, setSortAlder] = useState<string>("");

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
  };

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
    setSelectedDeltager((prev) => {
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
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    const selectedDiscipliner = discipliner.filter((disciplin) => selectedOptions.includes(disciplin.navn));
    // Update selectedDisciplin state
    setSelectedDisciplin(selectedDiscipliner);
    setSelectedDeltager((prev) => {
      if (prev === null) {
        return null;
      } else {
        return { ...prev, discipliner: selectedDiscipliner };
      }
    });
  };

  const handleSearch = async (searchTerm: string) => {
    if (searchTerm) {
      const response = await getDeltagerByName(searchTerm);
      console.log("Search response:", response); // Log the response
      const searchedDeltagere = Array.isArray(response) ? response : [response];
      setDeltagere(searchedDeltagere);
    } else {
      fetchDeltagere();
    }
  };

  const openDeltagerDetails = (deltager: Deltager) => {
    setSelectedDeltager(deltager);
    setIsModalOpen(true);
    setModalType("details");
  };

  const handleFilterChange = async (køn?: string, minAlder?: number, maxAlder?: number, klub?: string, disciplin?: string) => {
    try {
      // Log the filter parameters
      console.log("Filter parameters:", {
        køn,
        minAlder,
        maxAlder,
        klub,
        disciplin,
      });

      const response = await getFilteredDeltagere(køn, minAlder, maxAlder, klub, disciplin);

      // Log the response from the API
      console.log("Filtered deltagere response:", response);

      setDeltagere(response);
    } catch (error) {
      console.error("Error fetching filtered deltagere:", error);
      setDeltagere([]);
    }
  };

  const handleKønChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilterKøn(value);
    handleFilterChange(value, filterMinAlder ?? undefined, filterMaxAlder ?? undefined, filterKlub, filterDisciplin);
  };

  const handleAlderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [min, max] = e.target.value.split("-").map(Number);
    setFilterMinAlder(min);
    setFilterMaxAlder(max);
    handleFilterChange(filterKøn, min, max, filterKlub, filterDisciplin);
  };

  const handleKlubChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilterKlub(value);
    handleFilterChange(filterKøn, filterMinAlder ?? undefined, filterMaxAlder ?? undefined, value, filterDisciplin);
  };

  const handleDisciplinFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilterDisciplin(value);
    handleFilterChange(filterKøn, filterMinAlder ?? undefined, filterMaxAlder ?? undefined, filterKlub, value);
  };


  // Sorting
  const sortDeltagere = (deltagere: Deltager[]) => {
    const sortedDeltagere = [...deltagere];

    if (sortKøn) {
      sortedDeltagere.sort((a, b) => sortKøn === "asc" ? a.køn.localeCompare(b.køn) : b.køn.localeCompare(a.køn));
    }

    if (sortAlder) {
      sortedDeltagere.sort((a, b) => sortAlder === "asc" ? a.alder - b.alder : b.alder - a.alder);
    }

    return sortedDeltagere;
  };

  const handleSortKønClick = () => {
    setSortKøn((prevSortKøn) => {
      if (prevSortKøn === "") return "asc";
      if (prevSortKøn === "asc") return "desc";
      return "";
    });
  };

  const handleSortAlderClick = () => {
    setSortAlder((prevSortAlder) => {
      if (prevSortAlder === "") return "asc";
      if (prevSortAlder === "asc") return "desc";
      return "";
    });
  };

  useEffect(() => {
    setDeltagere(sortDeltagere(deltagere));
  }, [sortKøn, sortAlder]);

  return (
    <div>
      <h1 className="text-3xl font-bold leading-tight text-gray-900">Deltagere</h1>
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between">
        <SearchBar onSearch={handleSearch} />
        <Button onClick={() => openModal("create")} className="mt-4 sm:mt-0 sm:ml-4 py-2 px-4 rounded">
          Tilføj ny deltager
        </Button>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Filtrér Køn</label>
          <select
            value={filterKøn}
            onChange={handleKønChange}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Alle</option>
            <option value="Mand">Mand</option>
            <option value="Kvinde">Kvinde</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Filtrér Alder</label>
          <select
            value={`${filterMinAlder}-${filterMaxAlder}`}
            onChange={handleAlderChange}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Alle</option>
            <option value="6-9">Børn (6-9)</option>
            <option value="10-13">Unge (10-13)</option>
            <option value="14-22">Junior (14-22)</option>
            <option value="23-40">Voksne (23-40)</option>
            <option value="41-150">Senior (41-)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Filtrér Klub</label>
          <input
            type="text"
            value={filterKlub}
            onChange={handleKlubChange}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Indtast klub"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Filtrér Disciplin</label>
          <select
            value={filterDisciplin}
            onChange={handleDisciplinFilterChange}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Alle</option>
            {discipliner?.map((disciplin) => (
              <option key={disciplin.id} value={disciplin.navn}>
                {disciplin.navn}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex space-x-2">
        <SortButton label="Køn" sortOrder={sortKøn} onClick={handleSortKønClick} />
        <SortButton label="Alder" sortOrder={sortAlder} onClick={handleSortAlderClick} />
      </div>

      <DeltagerList
        deltagere={deltagere}
        openModal={openModal}
        openDeltagerDetails={openDeltagerDetails}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`${modalType.charAt(0).toUpperCase() + modalType.slice(1)} Deltager`}>
        {modalType === "details" ? (
          <DeltagerDetails deltager={selectedDeltager!} />
        ) : modalType !== "delete" ? (
          <DeltagerForm
          selectedDeltager={selectedDeltager}
          selectedDisciplin={selectedDisciplin}
          discipliner={discipliner}
          modalType={modalType}
          handleInputChange={handleInputChange}
          handleDisciplinChange={handleDisciplinChange}
          handleFormSubmit={handleFormSubmit}
        />
        ) : (
          <div>
            <p className="text-lg mb-4">Er du sikker på at du vil slette denne deltager?</p>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h2 className="text-gray-800 font-semibold">
                <span className="text-blue-600">{selectedDeltager?.navn}</span>
              </h2>
            </div>
            <div className="flex justify-end items-center p-4 mt-4 border-t border-gray-200">
              <Button onClick={handleDelete} variant="destructive" className=" py-2 px-4 rounded-l">
                Ja, slet
              </Button>
              <Button onClick={() => setIsModalOpen(false)} variant="secondary" className=" py-2 px-4 rounded-r ml-2 hover:bg-gray-200">
                Nej, gå tilbage
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
