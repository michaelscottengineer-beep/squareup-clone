import IntroduceSection from "./components/IntroduceSection";
import "./ShopLayout.css";


import DishSection from "./components/DishSection";

const ShopLayout = () => {
  return (
    <div className="relative">
      <main className="">
        <IntroduceSection />

        <DishSection />
      </main>
    </div>
  );
};


export default ShopLayout;
