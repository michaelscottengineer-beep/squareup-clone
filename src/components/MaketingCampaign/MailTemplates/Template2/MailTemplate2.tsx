import React, { useRef, useState } from "react";
import { Facebook, Youtube, Instagram } from "lucide-react";
import useTemplate2Editor from "@/stores/template-editor/useTemplate2Editor";
import SettingOverlay from "@/components/templates/SettingOverlay";
import HeaderSection from "./HeaderSection";
import FooterSection from "./FooterSection";
import HeroBannerSection from "./HeroBannerSection";
import GreetingSection from "./GreetingSection";
import OfferSection from "./OfferSection";
import CTASection from "./CTASection";
import useAuth from "@/hooks/use-auth";
import useTemplate1Editor from "@/stores/template-editor/useTemplate1Editor";
import { useParams } from "react-router";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import { useRestaurantFirebaseKey } from "@/factory/restaurant/restaurant.firebasekey";
import { useMutation } from "@tanstack/react-query";
import { push, ref, set } from "firebase/database";
import { db } from "@/firebase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import UploadImageArea from "@/components/UploadImageArea";

const Panel = ({
  outerHTMLRef,
}: {
  outerHTMLRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const { user } = useAuth();
  const sections = useTemplate2Editor((state) => state.sections);
  const footer = useTemplate2Editor((state) => state.footer);
  const isEditing = useTemplate2Editor((state) => state.isEditing);
  const toggleEdit = useTemplate2Editor((state) => state.toggleEdit);
  const [imgUrl, setImgUrl] = useState("");
  // const restaurantId = useCurrentRestaurantId((state) => state.id);
  // const keys = useRestaurantFirebaseKey({ restaurantId });
  const { mailTemplateId } = useParams();
  const restaurantId = useCurrentRestaurantId((state) => state.id);

  const keys = useRestaurantFirebaseKey({ restaurantId, mailTemplateId });

  const { mutate: publish, isPending: isPublishing } = useMutation({
    mutationFn: async () => {
      return await set(ref(db, "allMailTemplates/mailTemplate2"), {
        rawData: { sections, footer },
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
          rawData: { sections, footer },
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

export default function MailTemplate2() {
  const outerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={`bg-[]`}
      style={{
        backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='none' stroke='rgb(226 232 240 / 0.8)' stroke-dasharray='5 3' transform='scale(1 -1)' viewBox='0 0 32 32'%3E%3Cpath d='M0 .5h31.5V32'/%3E%3C/svg%3E")`,
      }}
    >
      <Panel outerHTMLRef={outerRef} />
      <div className="bg-gray-100 max-w-[800px] mx-auto py-4 rounded-md">
        <div
          style={{
            maxWidth: "600px",
            margin: "auto",
            boxShadow: "0 10px 15px rgba(0,0,0,0.08)",
          }}
          ref={outerRef}
        >
          {/* Container */}
          <HeaderSection />

          {/* HERO */}
          <HeroBannerSection />

          {/* GREETING */}
          <GreetingSection />

          {/* offer */}

          <OfferSection />

          {/* CTA */}
          <CTASection />

          <FooterSection />
        </div>
      </div>
    </div>
  );
}
