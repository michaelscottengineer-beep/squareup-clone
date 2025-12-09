"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Mail,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Info,
  Columns,
  Search,
  List,
  X,
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  convertFirebaseArrayData,
  convertSegmentToQueryKey,
  initFirebaseUpdateVariable,
} from "@/utils/helper";
import { useBrevoFirebaseKey } from "@/factory/brevo/brevo.firebaseKey";
import { get, increment, ref, update } from "firebase/database";
import type { TContact, TContactList } from "@/types/brevo";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useNavigate } from "react-router";
import type { CheckedState } from "@radix-ui/react-checkbox";
import { db } from "@/firebase";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import type { TRestaurantCustomer } from "@/types/restaurant";
import { useRestaurantFirebaseKey } from "@/factory/restaurant/restaurant.firebasekey";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";

const mockContacts = [
  {
    id: "1",
    contact: "realnobita1505@gmail.com",
    subscribed: ["Email"],
    blocklisted: false,
    email: "realnobita1505@gmail.c...",
    landlineNumber: "",
    lastChanged: "01/12/2025",
    creationDate: "01/12/2025",
  },
  {
    id: "2",
    contact: "Nguyen Minh",
    subscribed: ["Email", "SMS"],
    blocklisted: false,
    email: "minhnv155@gmail.com",
    landlineNumber: "",
    lastChanged: "01/12/2025",
    creationDate: "01/12/2025",
  },
];

interface ContactTableProps {
  data: TRestaurantCustomer[];
}
export function ContactTable({ data }: ContactTableProps) {
  const [selectedRows, setSelectedRows] = useState<TRestaurantCustomer[]>([]);

  const toggleRow = (c: CheckedState, data: TRestaurantCustomer) => {
    if (c === true) setSelectedRows((prev) => [...prev, data]);
    else if (c === false)
      setSelectedRows((prev) => prev.filter((row) => row.id !== data.id));
  };

  const toggleAll = () => {
    // setSelectedRows((prev) =>
    //   prev.length === mockContacts.length ? [] : mockContacts.map((c) => c.id)
    // );
  };

  return (
    <div>
      <div className="mb-2">
        {selectedRows.length && <AddToListDialog contacts={data} />}
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedRows.length === mockContacts.length}
                  onCheckedChange={toggleAll}
                />
              </TableHead>
              <TableHead className="font-semibold">CONTACT</TableHead>
              <TableHead className="font-semibold">SUBSCRIBED</TableHead>
              <TableHead className="font-semibold">EMAIL</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((contact) => (
              <TableRow key={contact.id} className="hover:bg-muted/30">
                <TableCell>
                  <Checkbox
                    checked={!!selectedRows.find((sr) => sr.id === contact.id)}
                    onCheckedChange={(c) => toggleRow(c, contact)}
                  />
                </TableCell>
                <TableCell>
                  <a href="#" className="text-[#0b4d2c] hover:underline">
                    {contact.basicInfo.fullName}
                  </a>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {[contact.basicInfo.email, contact.basicInfo.sms].map(
                      (sub) => {
                        if (!sub) return undefined;

                        return (
                          <Badge
                            key={sub}
                            variant="secondary"
                            className="bg-[#e3f2fd] text-[#1565c0] hover:bg-[#e3f2fd]"
                          >
                            {sub.includes("@") ? (
                              <Mail className="h-3 w-3 mr-1" />
                            ) : (
                              <MessageSquare className="h-3 w-3 mr-1" />
                            )}
                            {sub.includes("@") ? "Email" : "SMS"}
                          </Badge>
                        );
                      }
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {contact.basicInfo.email}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

const AddToListDialog = ({ contacts }: { contacts: TRestaurantCustomer[] }) => {
  const navigate = useNavigate();
  const restaurantId = useCurrentRestaurantId((state) => state.id);

  const [checkedList, setCheckedList] = useState<TContactList[]>([]);
  const keys = useRestaurantFirebaseKey({ restaurantId });
  const { data } = useQuery({
    queryKey: convertSegmentToQueryKey(keys.allLists()),
    queryFn: async () => {
      const docs = await get(keys.allListsRef());

      return convertFirebaseArrayData<TContactList>(docs.val());
    },
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const updates = initFirebaseUpdateVariable();

      for (const l of checkedList) {
        const id = l.id;
        keys.setParams({ listId: id });
        for (const c of contacts) {
          updates[keys.contactsOfList() + "/" + c.id] = {
            email: c.basicInfo.email,
            id: c.id,
            sms: c.basicInfo.sms,
            fullName: c.basicInfo.fullName,
          };

          await fetch(import.meta.env.VITE_BASE_URL + "/topics/subscription", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              TopicArn: l.basicInfo.topicArn,
              PhoneNumber: c.basicInfo.sms,
            }),
          });
        }

        updates[keys.detailedList() + "/stats/totalContact"] = increment(
          contacts.length ?? 0
        );
      }

      return await update(ref(db), updates);
    },
    onSuccess: () => {
      toast.success("Add to list(s) successfully!");
    },
    onError: (err) => {
      toast.error("Add to list(s) failed: " + err.message);
    },
  });

  const handleCheckedChange = (check: CheckedState, d: TContactList) => {
    if (check === true) {
      setCheckedList((prev) => [...prev, d]);
    } else if (check === false) {
      setCheckedList((prev) => prev.filter((c) => c.id !== d.id));
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"sm"}>
          <List /> Add to a list(s)
        </Button>
      </DialogTrigger>

      <DialogContent showCloseButton={false}>
        <DialogHeader className="flex flex-row justify-between">
          <DialogTitle>Add to list(s)</DialogTitle>
          <DialogClose>
            <X />
          </DialogClose>
        </DialogHeader>

        <div className="flex flex-col gap-1 min-h-[200px]">
          {data?.map((list) => {
            return (
              <div id={list.id} className="flex items-center gap-2">
                <Checkbox
                  checked={!!checkedList.find((c) => c.id === list.id)?.id}
                  onCheckedChange={(c) => {
                    handleCheckedChange(c, list);
                  }}
                />
                <span>{list.basicInfo.name}</span>
              </div>
            );
          })}
        </div>

        <div className="flex">
          <Button
            onClick={() => {
              mutation.mutate();
            }}
            size={"sm"}
            className="ml-auto"
            variant={"secondary"}
            disabled={mutation.isPending}
          >
            {mutation.isPending && <Spinner />} Add
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
