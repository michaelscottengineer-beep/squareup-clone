import useTemplate1Editor from "@/stores/template-editor/useTemplate1Editor";
import React, { useRef, useState } from "react";
import SettingOverlay from "@/components/templates/SettingOverlay";
import SettingNewsLetterSection from "./SettingNewsLetterSection";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { push, ref, set } from "firebase/database";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import { useRestaurantFirebaseKey } from "@/factory/restaurant/restaurant.firebasekey";
import { db } from "@/firebase";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import UploadImageArea from "@/components/UploadImageArea";
import { Label } from "@/components/ui/label";
import { useParams } from "react-router";
import HeaderSetting from "./HeaderSetting";
import { Globe, Mail, MapPin, Phone } from "lucide-react";
import GmailFooter from "./GmailFooter";

const Panel = ({
  outerHTMLRef,
}: {
  outerHTMLRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const { user } = useAuth();
  const header = useTemplate1Editor((state) => state.header);
  const sections = useTemplate1Editor((state) => state.sections);
  const footer = useTemplate1Editor((state) => state.footer);
  const isEditing = useTemplate1Editor((state) => state.isEditing);
  const toggleEdit = useTemplate1Editor((state) => state.toggleEdit);
  const [imgUrl, setImgUrl] = useState("");
  // const restaurantId = useCurrentRestaurantId((state) => state.id);
  // const keys = useRestaurantFirebaseKey({ restaurantId });
  const { mailTemplateId } = useParams();
  const restaurantId = useCurrentRestaurantId((state) => state.id);

  const keys = useRestaurantFirebaseKey({ restaurantId, mailTemplateId });

  const { mutate: publish, isPending: isPublishing } = useMutation({
    mutationFn: async () => {
      return await push(ref(db, "allMailTemplates"), {
        rawData: { header, sections, footer },
        html: outerHTMLRef.current?.innerHTML,
        imgUrl,
      });
    },
    onSuccess: () => {
      toast.success("Published successfully!");
    },
    onError: (err) => {
      toast.error("Published error: " + err.message);
    },
  });

  const { mutate: save, isPending: isSaving } = useMutation({
    mutationFn: async () => {
      return await set(
        ref(db, keys.detailedMailTemplate() + "/rootMailTemplate"),
        {
          rawData: { header, sections, footer },
          html: outerHTMLRef.current?.innerHTML,
        }
      );
    },
    onSuccess: () => {
      toast.success("Saved successfully!");
    },
    onError: (err) => {
      toast.error("Saved error: " + err.message);
    },
  });

  return (
    <div className="flex justify-end gap-4 p-5">
      {user?.role === "admin" && (
        <>
          <Button onClick={() => toggleEdit(!isEditing)}>Toogle Edit</Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"outline"}>Pushlish</Button>
            </DialogTrigger>

            <DialogContent>
              <Label>Preview Image</Label>
              <UploadImageArea
                value={imgUrl}
                onValueChange={(url) => setImgUrl(url)}
              />

              <DialogFooter>
                <Button onClick={() => publish()} disabled={isPublishing}>
                  Done
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
      {isEditing && (
        <Button onClick={() => save()} disabled={isSaving}>
          Save&Quit
        </Button>
      )}
    </div>
  );
};

const MailTemplate1 = () => {
  const header = useTemplate1Editor((state) => state.header);
  const sections = useTemplate1Editor((state) => state.sections);
  const footer = useTemplate1Editor((state) => state.footer);
  const outerRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <Panel outerHTMLRef={outerRef} />
      <div ref={outerRef}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              maxWidth: "600px",
              width: "100%",
            }}
          >
            <HeaderSection />
            <NewsLetterSection />

            <GmailFooter />
          </div>
        </div>
      </div>
    </div>
  );
};

const HeaderSection = () => {
  const header = useTemplate1Editor((state) => state.header);
  const isEditing = useTemplate1Editor((state) => state.isEditing);

  return (
    <div className="relative">
      <img
        src={header.elements.logo.data?.src}
        style={{
          aspectRatio: 16 / 9,
          width: "100%",
          borderRadius: "10px",
        }}
      />
      {isEditing && (
        <SettingOverlay
          style={{ display: "none" }}
          className="block!"
          settingContent={<HeaderSetting />}
        />
      )}
    </div>
  );
};

const NewsLetterSection = () => {
  const body = useTemplate1Editor((state) => state.sections["body"]);
  const isEditing = useTemplate1Editor((state) => state.isEditing);

  const els = body.elements;

  const getFlexDirection = () => {
    switch (els.layout.data?.value) {
      case "LTR":
        return "row";
      case "RTL":
        return "row-reverse";
      case "TTB":
        return "column";
      case "BTT":
        return "column-reverse";
    }
  };

  return (
    <div
      className="relative"
      style={{
        display: "flex",
        flexDirection: getFlexDirection(),
        marginTop: 5,
      }}
    >
      <div>
        <h2 style={els.newsLetterTitle.style}>{els.newsLetterTitle.text}</h2>

        <p style={els.newsLetterDescription.style}>
          {els.newsLetterDescription.text}
        </p>
      </div>

      <div
        style={{
          justifyContent: "center",
          display: "flex",
        }}
      >
        <a
          href={els.newsLetterCTAButton.data?.url}
          style={els.newsLetterCTAButton.style}
        >
          {els.newsLetterCTAButton.text}
        </a>
      </div>

      {isEditing && (
        <SettingOverlay
          settingContent={<SettingNewsLetterSection />}
          style={{ display: "none" }}
          className="block!"
        />
      )}
    </div>
  );
};
export default MailTemplate1;
