import "@/styles/phoCharlestonTemplate.css";

import PhoCharlestonHeader from "./components/Header";

import ListeningStack from "./components/ListeningStack";
import AboutUs from "./components/AboutUs";
import CarouselIntroduce from "./components/CarouselIntroduce";
import Special from "./components/Special";
import { createContext, type PropsWithChildren } from "react";

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

const PhoCharleston = () => {
  return (
    <div>
      <PhoCharlestonHeader />

      <AboutUs aboutUsKey="aboutUsCatering" />
      <AboutUs aboutUsKey="aboutUsGroupAndParties" />

      <CarouselIntroduce />
      <Special />
      <AboutUs aboutUsKey="aboutUs" />
      <ListeningStack />
    </div>
  );
};

export default PhoCharleston;
