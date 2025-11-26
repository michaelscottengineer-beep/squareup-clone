import React, { useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import usePhoCharlestonEditor from "@/stores/template-editor/usePhoCharlestonEditor";
import { Link, useNavigate, useNavigation } from "react-router";
import SettingOverlay from "@/components/templates/SettingOverlay";

import CarouselIntroduceSettingContent from "./settings/CarouselIntroduceSettingContent";

type TCarouselItem = {
  img: string;
  buttonText: string;
  buttonUrl: string;
  title: string;
  subTitle: string;
};

const CarouselIntroduce = () => {
  const [api, setApi] = React.useState<CarouselApi>();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const carouselIntroduceData = usePhoCharlestonEditor(
    (state) => state.sections["carouselIntroduce"]
  );
  const isEditing = usePhoCharlestonEditor((state) => state.isEditing);

  const carouselData = carouselIntroduceData.elements.carousel.data;
  return (
    <div className="relative">
      <Carousel className="w-full relative" setApi={setApi}>
        <CarouselContent>
          {carouselData?.items.map((item: TCarouselItem, index: number) => (
            <CarouselItem key={index} className="relative">
              <img
                src={item.img}
                className="object-cover w-full max-h-[450px] "
                alt={"slide show " + index}
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 flex items-center flex-col gap-4 -translate-y-1/2 z-10 ">
                {item.title && (
                  <span
                    className="uppercase text-5xl font-extrabold space leading-16 text-white text-pretty text-center"
                    dangerouslySetInnerHTML={{ __html: item.title }}
                  ></span>
                )}
                {item.subTitle && (
                  <span className="uppercase text-xl font-bold text-white">
                    {item.subTitle}
                  </span>
                )}

                {item.buttonText && (
                  <Button
                    asChild
                    className="bg-[#474947] border-2 text-lg uppercase border-[#BCBCBC] text-[#D7D9D6] hover:text-white hover:border-[#A5DD99] hover:bg-[#474947] w-max px-10 py-2 h-max"
                  >
                    <Link to={item.buttonUrl}>{item.buttonText}</Link>
                  </Button>
                )}
              </div>
              <div className="overlay w-full h-full top-0 left-0 absolute bg-black/40"></div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="dots flex gap-2 absolute left-1/2 -translate-x-1/2 bottom-5 ">
          {carouselData?.items.map((item: TCarouselItem, i: number) => {
            return (
              <div
                className={cn(
                  "w-5 h-5 rounded-full bg-white/30 backdrop-blur-2xl cursor-pointer",
                  {
                    "bg-[#a5db99]": currentSlide === i,
                  }
                )}
                key={item.title}
                onClick={() => {
                  api?.scrollTo(i);
                  setCurrentSlide(i);
                }}
              ></div>
            );
          })}
        </div>
      </Carousel>
      {isEditing && (
        <SettingOverlay settingContent={<CarouselIntroduceSettingContent />} />
      )}
    </div>
  );
};

export default CarouselIntroduce;
