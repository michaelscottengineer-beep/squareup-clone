"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ContactPageHeaderProps {
  onCreateContact: () => void
}

export function ContactPageHeader({ onCreateContact }: ContactPageHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Contacts</h1>
          <p className="text-muted-foreground mt-1">
            This is your contact database. From here, you can view, organize and manage your contacts, individually or
            as a group.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCreateContact}>
            Create a contact
          </Button>
          <Button className="bg-[#0b4d2c] hover:bg-[#094025] text-white">Import contacts</Button>
        </div>
      </div>
      <div className="flex gap-2">
        <Select>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Load a list or a segment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All contacts</SelectItem>
            <SelectItem value="subscribed">Subscribed</SelectItem>
            <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Add filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="sms">SMS</SelectItem>
            <SelectItem value="date">Date</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
