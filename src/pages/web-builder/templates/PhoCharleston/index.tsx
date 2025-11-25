import "@/styles/phoCharlestonTemplate.css";

import PhoCharlestonHeader from "./components/Header";

import ListeningStack from "./components/ListeningStack";
import AboutUs from "./components/AboutUs";

const PhoCharleston = () => {
  return (
    <div>
      <PhoCharlestonHeader />

      <AboutUs aboutUsKey="aboutUsCatering" />
      <AboutUs aboutUsKey="aboutUsGroupAndParties" />
      <AboutUs aboutUsKey="aboutUs" />
      <ListeningStack />
    </div>
  );
};

export default PhoCharleston;
