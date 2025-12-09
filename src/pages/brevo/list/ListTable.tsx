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
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  convertFirebaseArrayData,
  convertSegmentToQueryKey,
} from "@/utils/helper";
import { useBrevoFirebaseKey } from "@/factory/brevo/brevo.firebaseKey";
import { get } from "firebase/database";
import type { TContact, TContactList } from "@/types/brevo";
import { formatDate } from "date-fns";
import { Link } from "react-router";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import { useRestaurantFirebaseKey } from "@/factory/restaurant/restaurant.firebasekey";

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

export function ListTable() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const keys = useRestaurantFirebaseKey({ restaurantId });

  const { data } = useQuery({
    queryKey: convertSegmentToQueryKey(keys.allLists()),
    queryFn: async () => {
      const docs = await get(keys.allListsRef());

      return convertFirebaseArrayData<TContactList>(docs.val());
    },
  });

  const toggleRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelectedRows((prev) =>
      prev.length === mockContacts.length ? [] : mockContacts.map((c) => c.id)
    );
  };

  return (
    <div className="mt-6 space-y-4">
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
              <TableHead className="font-semibold uppercase">NAME</TableHead>
              <TableHead className="font-semibold uppercase">ID</TableHead>
              <TableHead className="font-semibold uppercase">
                Contacts
              </TableHead>
              <TableHead className="font-semibold uppercase">
                Creation Date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((list) => (
              <TableRow key={list.id} className="hover:bg-muted/30">
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(list.id)}
                    onCheckedChange={() => toggleRow(list.id)}
                  />
                </TableCell>
                <TableCell>
                  <Link
                    to={`/brevo/list/` + list.id}
                    className="text-[#0b4d2c] hover:underline underline"
                  >
                    {list.basicInfo.name}
                  </Link>
                </TableCell>
                <TableCell>{list.id}</TableCell>
                <TableCell className="">
                  {list.stats?.totalContact ?? 0}
                </TableCell>
                <TableCell className="">
                  {formatDate(new Date(list.basicInfo.createdAt), "yyyy-MM-dd")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end gap-4">
        <div className="flex items-center gap-2">
          <Select defaultValue="20">
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">Rows per page</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">1-2 of 2</span>
          <Select defaultValue="1">
            <SelectTrigger className="w-[60px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">of 1 pages</span>
          <Button variant="ghost" size="icon" disabled>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" disabled>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
