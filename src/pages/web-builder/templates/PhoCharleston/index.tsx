import "@/styles/phoCharlestonTemplate.css";

import PhoCharlestonHeader from "./components/Header";

import ListeningStack from "./components/ListeningStack";
import AboutUs from "./components/AboutUs";
import CarouselIntroduce from "./components/CarouselIntroduce";

const PhoCharleston = () => {
  return (
    <div>
      <PhoCharlestonHeader />

      <AboutUs aboutUsKey="aboutUsCatering" />
      <AboutUs aboutUsKey="aboutUsGroupAndParties" />

      <CarouselIntroduce />
      <AboutUs aboutUsKey="aboutUs" />
      <ListeningStack />
    </div>
  );
};

export default PhoCharleston;
