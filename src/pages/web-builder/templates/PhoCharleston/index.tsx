import "@/styles/phoCharlestonTemplate.css";

import PhoCharlestonHeader from "./components/Header";

import ListeningStack from "./components/ListeningStack";
import AboutUs from "./components/AboutUs";
import CarouselIntroduce from "./components/CarouselIntroduce";
import Special from "./components/Special";
import { createContext, useEffect, type PropsWithChildren } from "react";
import usePhoCharlestonEditor from "@/stores/template-editor/usePhoCharlestonEditor";
import { Button } from "@/components/ui/button";
import { Edit, X } from "lucide-react";

const PhoCharlestonContext = createContext<{
  isEditing: boolean;
}>({
  isEditing: false,
});

// const PhoCharlestonProvider = ({ children }: PropsWithChildren) => {
//   return (
//     <PhoCharlestonContext.Provider value={{

//     }}>{children}</PhoCharlestonContext.Provider>
//   );
// };

interface PhoCharlestonProps {
  isAllowedToEdit?: boolean;
}

const PhoCharleston = ({ isAllowedToEdit  }: PhoCharlestonProps) => {
  const toggleEdit = usePhoCharlestonEditor((state) => state.toggleEdit);

  useEffect(() => {
    if (isAllowedToEdit) toggleEdit(true);
  }, [isAllowedToEdit]);

  return (
    <div className="relative">
      <PhoCharlestonHeader />

      <AboutUs aboutUsKey="aboutUsCatering" />
      <AboutUs aboutUsKey="aboutUsGroupAndParties" />

      <CarouselIntroduce />
      <Special />
      <AboutUs aboutUsKey="aboutUs" />

      <StackEvent />

      {isAllowedToEdit && <ToggleEditButton />}
    </div>
  );
};

const ToggleEditButton = () => {
  const isEditing = usePhoCharlestonEditor((state) => state.isEditing);
  const toggleEdit = usePhoCharlestonEditor((state) => state.toggleEdit);

  return (
    <Button
      className="absolute bottom-5 right-5 rounded-full"
      onClick={() => {
        toggleEdit(!isEditing);
      }}
    >
      {isEditing ? <X /> : <Edit />}
    </Button>
  );
};
const StackEvent = () => {
  const isEditing = usePhoCharlestonEditor((state) => state.isEditing);

  return isEditing ? <ListeningStack /> : null;
};

export default PhoCharleston;
