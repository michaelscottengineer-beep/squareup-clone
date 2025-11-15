import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { TMember } from "@/types/staff";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

const StaffMemberList = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="header flex items-center justify-between">
        <h1>StaffMemberList</h1>
      </div>

      <div>
          <Button onClick={() => navigate('/dashboard/staffs/members/new')}>Add Member</Button>
      </div>
    </div>
  );
};

export default StaffMemberList;
