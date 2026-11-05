"use client";

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

import { useUpgradeDialog } from './UpgradeDialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { useRouter } from "next/navigation";


const WorkspaceDialog = ({trigger} : {trigger: React.ReactNode}) => {
    const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          {/* <DialogTitle>{workspace ? "Edit workspace" : "Create a workspace"}</DialogTitle> */}
          <DialogTitle>Create a workspace</DialogTitle>
        </DialogHeader>
        {/* Mounted per open, so the fields always start from the current values. */}
        <WorkspaceForm onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}


function WorkspaceForm({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  const openUpgrade = useUpgradeDialog();

  const handleSubmit = async () => {};

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="workspace-name">Name</Label>
        <Input
          id="workspace-name"
          placeholder="Q1 Marketing Launch"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="workspace-description">
          Description{" "}
          <span className="text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="workspace-description"
          placeholder="What's this workspace for?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
        <DialogFooter>
            <Button>Create</Button>
        </DialogFooter>
      </div>
    </>
  );
}

export default WorkspaceDialog;
