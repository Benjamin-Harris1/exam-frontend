import { useState } from "react";
import { DeltagerManager } from "./DeltagerManager";
import { DisciplinManager } from "./DisciplinManager";
import { Button } from "@/components/ui/button";


export default function AdminPage() {

  type Tabs = "deltager" | "disciplin" | "resultat";

  // Determine the initial tab
  const getInitialTab = (): Tabs => {
    return "deltager"; // Fallback default
  };

  const [activeTab, setActiveTab] = useState<Tabs>(getInitialTab());

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-4 m-auto mt-2 mb-4 sm:flex-nowrap">

          <>
            <Button
              onClick={() => setActiveTab("deltager")}
              variant={activeTab === "deltager" ? "default" : "outline"}
              size="default"
              className="flex-1 rounded-l"
            >
              Deltagere
            </Button>
            <Button
              onClick={() => setActiveTab("disciplin")}
              variant={activeTab === "disciplin" ? "default" : "outline"}
              size="default"
              className="flex-1 rounded-l"
            >
              Discipliner
            </Button>
            <Button
              onClick={() => setActiveTab("resultat")}
              variant={activeTab === "resultat" ? "default" : "outline"}
              size="default"
              className="flex-1 rounded-l"
            >
              Resultater
            </Button>
          </>

      </div>
      {activeTab === "deltager" && <DeltagerManager />}
      {activeTab === "disciplin" && <DisciplinManager />}
      {activeTab === "resultat" && <DeltagerManager />}
    </div>
  );
}
