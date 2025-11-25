import "@/styles/phoCharlestonTemplate.css";

import PhoCharlestonHeader from "./components/Header";

import ListeningStack from "./components/ListeningStack";
import AboutUs from "./components/AboutUs";
import CarouselIntroduce from "./components/CarouselIntroduce";
import Special from "./components/Special";
import {
  createContext,
  useEffect,
  useRef,
  type PropsWithChildren,
} from "react";
import usePhoCharlestonEditor, { type TPartEditorData, type TTemplateEditorStateStore } from "@/stores/template-editor/usePhoCharlestonEditor";
import { Button } from "@/components/ui/button";
import { Edit, Save, UploadCloud, X } from "lucide-react";
import PublishTemplateButton from "@/components/templates/PublishTemplateButton";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import templateFirebaseKey from "@/factory/template/template.firebaseKey";
import { push, ref, set, update } from "firebase/database";
import { useParams } from "react-router";
import { parseSegments } from "@/utils/helper";
import useAuth from "@/hooks/use-auth";
import useEditorTemplateState from "@/stores/use-editor-template-state";
import { db } from "@/firebase";
import { toast } from "sonner";
import InformationSection from "./components/InfomationSection";

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
  templateId?: string;
  createdBy?: string;
  initData?: TTemplateEditorStateStore;
}

const PhoCharleston = ({ isAllowedToEdit, createdBy, initData}: PhoCharlestonProps) => {
  const toggleEdit = usePhoCharlestonEditor((state) => state.toggleEdit);
  const setAllData = usePhoCharlestonEditor((state) => state.setAllData);
  const outerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (isAllowedToEdit) toggleEdit(true);
  }, [isAllowedToEdit]);

  useEffect(() => {
    if (initData) setAllData(initData)
  }, [initData])

  return (
    <div className="relative">
      <div ref={outerRef}>
        <PhoCharlestonHeader />

        <AboutUs aboutUsKey="aboutUsCatering" />
        <AboutUs aboutUsKey="aboutUsGroupAndParties" />

        <CarouselIntroduce />
        <Special />
        <AboutUs aboutUsKey="aboutUs" />

        <InformationSection/>
      </div>
      <StackEvent />
      <PublishTemplate outerHTML={outerRef} />

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

const UserActionButton = ({
  templateId,
  outerHTML,
}: {
  templateId?: string;
  outerHTML: React.RefObject<HTMLDivElement | null>;
}) => {
  const { user } = useAuth();
  const { websiteId } = useParams();
  const header = usePhoCharlestonEditor((state) => state.header);
  const footer = usePhoCharlestonEditor((state) => state.footer);
  const sections = usePhoCharlestonEditor((state) => state.sections);

  const mutate = useMutation({
    mutationFn: async () => {
      const keys = templateFirebaseKey({});
      const newTemplateKey = templateId;
      keys.addParams({ templateId: newTemplateKey });

      return await set(
        ref(db, parseSegments("websites", user?.uid, websiteId, "partData")),
        {
          header,
          footer,
          sections,
        }
      );
    },
    onSuccess: () => {
      toast.success("Save template successfully!");
    },
    onError: (err) => {
      toast.error("Save template Error successfully! " + err.message);
    },
  });

  const { mutate: publish } = useMutation({
    mutationFn: async () => {
      const keys = templateFirebaseKey({});
      const newTemplateKey = templateId;
      keys.addParams({ templateId: newTemplateKey });

      const updates: { [key: string]: any } = {};

      updates[parseSegments("websites", user?.uid, websiteId, "partData")] = {
        header,
        footer,
        sections,
      };

      updates[parseSegments("websites", user?.uid, websiteId, "outerHTML")] =
        outerHTML.current?.outerHTML;

      return await update(ref(db), updates);
    },
    onSuccess: () => {
      toast.success("Publish template successfully!");
    },
    onError: (err) => {
      toast.error("Publish template Error successfully! " + err.message);
    },
  });

  return (
    <div className="flex flex-col gap-2 fixed bottom-16 right-5">
      <Button className="bg-purple-500" onClick={() => mutate.mutate()}>
        <Save />
      </Button>
      <Button onClick={() => publish()}>
        <UploadCloud />
      </Button>
    </div>
  );
};
const ToggleEditButton = () => {
  const isEditing = usePhoCharlestonEditor((state) => state.isEditing);
  const toggleEdit = usePhoCharlestonEditor((state) => state.toggleEdit);

  return (
    <Button
      className={cn("fixed bottom-5 right-5 rounded-full", {
        "bg-yellow-500": !isEditing,
        "bg-destructive": isEditing,
      })}
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
