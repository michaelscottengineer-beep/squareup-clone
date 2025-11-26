import "@/styles/phoCharlestonTemplate.css";

import PhoCharlestonHeader from "./components/Header";

import ListeningStack from "./components/ListeningStack";
import AboutUs from "./components/AboutUs";
import CarouselIntroduce from "./components/CarouselIntroduce";
import Special from "./components/Special";
import { useEffect, useRef } from "react";
import usePhoCharlestonEditor, {
  type TTemplateEditorStateStore,
} from "@/stores/template-editor/usePhoCharlestonEditor";

import PublishTemplateButton from "@/components/templates/PublishTemplateButton";

import useAuth from "@/hooks/use-auth";

import InformationSection from "./components/InfomationSection";
import HeroBanner from "./components/HeroBanner";
import { GallerySection } from "./components/GallerySection";
import ToggleEditButton from "./components/ToggleEditButton";
import UserActionButton from "./components/UserActionButton";

interface PhoCharlestonProps {
  isAllowedToEdit?: boolean;
  templateId?: string;
  createdBy?: string;
  initData?: TTemplateEditorStateStore;
}

const PhoCharleston = ({
  isAllowedToEdit,
  createdBy,
  initData,
}: PhoCharlestonProps) => {
  const toggleEdit = usePhoCharlestonEditor((state) => state.toggleEdit);
  const setAllData = usePhoCharlestonEditor((state) => state.setAllData);
  const outerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (isAllowedToEdit) toggleEdit(true);
  }, [isAllowedToEdit]);

  useEffect(() => {
    if (initData) setAllData(initData);
  }, [initData]);

  return (
    <div className="relative">
      <div ref={outerRef}>
        <PhoCharlestonHeader />
        <HeroBanner />
        <AboutUs aboutUsKey="aboutUsCatering" />
        <AboutUs aboutUsKey="aboutUsGroupAndParties" />

        <CarouselIntroduce />
        <Special />
        <AboutUs aboutUsKey="aboutUs" />
        <GallerySection />
        <InformationSection />
      </div>
      <StackEvent />
      {!createdBy && <PublishTemplate outerHTML={outerRef} />}

      {user?.role === "admin" && <ToggleEditButton />}
      {isAllowedToEdit && createdBy === user?.uid && <ToggleEditButton />}
      {isAllowedToEdit && createdBy === user?.uid && (
        <UserActionButton outerHTML={outerRef} />
      )}
    </div>
  );
};

const PublishTemplate = ({
  outerHTML,
}: {
  outerHTML: React.RefObject<HTMLDivElement | null>;
}) => {
  const header = usePhoCharlestonEditor((state) => state.header);
  const footer = usePhoCharlestonEditor((state) => state.footer);
  const sections = usePhoCharlestonEditor((state) => state.sections);

  return (
    <PublishTemplateButton
      outerHTML={outerHTML}
      templateData={{
        header,
        footer,
        sections,
      }}
    />
  );
};

const StackEvent = () => {
  const isEditing = usePhoCharlestonEditor((state) => state.isEditing);

  return isEditing ? <ListeningStack /> : null;
};

export default PhoCharleston;
