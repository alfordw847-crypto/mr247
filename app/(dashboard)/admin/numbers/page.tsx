"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";

type MobileNumber = {
  id: string;
  number: string;
  type: string;
  bankName: string;
  createdAt: string;
};

export default function MobileNumbersPage() {
  const [numbers, setNumbers] = useState<MobileNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<MobileNumber | null>(null);
  const [form, setForm] = useState({ number: "", type: "", bankName: "" });
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  // Load data
  useEffect(() => {
    fetch("/api/mobile-numbers")
      .then((res) => res.json())
      .then((data) => {
        setNumbers(data.data || []);
        setLoading(false);
      });
  }, []);

  // Handle Add or Edit
  const handleSave = async () => {
    startTransition(async () => {
      try {
        const method = selected ? "PUT" : "POST";
        const url = selected
          ? `/api/mobile-numbers/${selected.id}`
          : "/api/mobile-numbers";

        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        const data = await res.json();
        if (data.success) {
          toast.success(
            selected ? "Updated successfully" : "Added successfully"
          );
          setForm({ number: "", type: "", bankName: "" });
          setSelected(null);
          setOpen(false);
          // refresh list
          const refreshed = await fetch("/api/mobile-numbers").then((r) =>
            r.json()
          );
          setNumbers(refreshed.data);
        } else {
          toast.error(data.message || "Something went wrong");
        }
      } catch (err: any) {
        toast.error(err.message);
      }
    });
  };

  // Handle Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this number?")) return;
    try {
      const res = await fetch(`/api/mobile-numbers/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setNumbers(numbers.filter((n) => n.id !== id));
        toast.success("Deleted successfully");
      } else {
        toast.error(data.message);
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Mobile Numbers</h1>
        <Button
          onClick={() => {
            setSelected(null);
            setForm({ number: "", type: "", bankName: "" });
            setOpen(true);
          }}
        >
          + Add Number
        </Button>
      </div>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected ? "Edit Number" : "Add Number"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Mobile Number"
              value={form.number}
              onChange={(e) => setForm({ ...form, number: e.target.value })}
            />

            {/* Type Select */}
            <Select
              value={form.type}
              onValueChange={(value) => setForm({ ...form, type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="agent">Agent</SelectItem>
              </SelectContent>
            </Select>

            {/* Bank Name Select */}
            <Select
              value={form.bankName}
              onValueChange={(value) => setForm({ ...form, bankName: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Bank" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bkash">Bkash</SelectItem>
                <SelectItem value="nogod">Nogod</SelectItem>
                <SelectItem value="rocket">Rocket</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button onClick={handleSave} disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Number</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Bank Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : numbers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No mobile numbers found.
              </TableCell>
            </TableRow>
          ) : (
            numbers.map((num) => (
              <TableRow key={num.id}>
                <TableCell>{num.number}</TableCell>
                <TableCell className="capitalize">{num.type}</TableCell>
                <TableCell className="capitalize">{num.bankName}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelected(num);
                        setForm({
                          number: num.number,
                          type: num.type,
                          bankName: num.bankName,
                        });
                        setOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      color="destructive"
                      onClick={() => handleDelete(num.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
