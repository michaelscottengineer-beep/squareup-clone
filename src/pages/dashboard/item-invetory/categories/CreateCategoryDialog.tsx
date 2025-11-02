import { Button } from "@/components/ui/button";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CategoryForm from "./CategoryForm";

export function CreateCategoryDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-full px-5 py-3">Create category</Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-screen! rounded-none h-screen"
        showCloseButton={false}
      >
        <CategoryForm />
      </DialogContent>
    </Dialog>
  );
}

export default CreateCategoryDialog;
