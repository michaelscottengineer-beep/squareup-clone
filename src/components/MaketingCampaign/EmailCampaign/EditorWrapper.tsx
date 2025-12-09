import ListSelector from "@/components/ListSelector";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { useRestaurantFirebaseKey } from "@/factory/restaurant/restaurant.firebasekey";
import { db } from "@/firebase";
import { cn } from "@/lib/utils";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import type { TCampaign, TContactList } from "@/types/brevo";
import { convertSegmentToQueryKey } from "@/utils/helper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { get, ref, set } from "firebase/database";
import { CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import React, { useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const EditorWrapper = ({
  title,
  description,
  children,
  isValid,
  triggerText,
}: {
  title: string;
  isValid?: boolean;
  description: string | ReactNode;
  triggerText: string;
  children: React.ReactNode;
}) => {
  return (
    <Collapsible className="border border-border rounded-xl group/item data-[state='open']:z-10 data-[state=open]:shadow-lg">
      <Item className="cursor-pointer hover:bg-muted/40 w-full rounded-none  p-4">
        <ItemMedia>
          <CheckCircle2
            className={cn("aspect-square fill-muted text-muted-foreground", {
              "fill-green-700 text-white": isValid,
            })}
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="text-xl">{title}</ItemTitle>
          <ItemDescription>{description}</ItemDescription>
        </ItemContent>

        <ItemActions className="group-data-[state=open]/item:hidden">
          <CollapsibleTrigger>
            <Button variant={"outline"} className="rounded-2xl">
              {triggerText}
            </Button>
          </CollapsibleTrigger>
        </ItemActions>
      </Item>
      <Separator className="group-data-[state=open]/item:block hidden" />
      <CollapsibleContent className="p-4 transition-all duration-500 animate-accordionUp">
        <div className=" ">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default EditorWrapper;
