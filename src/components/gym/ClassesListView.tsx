import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type Class = {
  class_id: number;
  class_name: string;
  schedule_time: string;
  max_capacity: number;
  trainer_id: number;
};

const ClassesListView = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("class")
        .select("*")
        .order("schedule_time", { ascending: true });

      if (error) throw error;
      setClasses(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch classes", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No classes found in the database.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Class Name</TableHead>
            <TableHead>Schedule</TableHead>
            <TableHead>Max Capacity</TableHead>
            <TableHead>Trainer ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map((classItem) => (
            <TableRow key={classItem.class_id}>
              <TableCell className="font-medium">{classItem.class_id}</TableCell>
              <TableCell className="font-semibold">{classItem.class_name}</TableCell>
              <TableCell>{classItem.schedule_time}</TableCell>
              <TableCell>
                <Badge variant="secondary">{classItem.max_capacity} people</Badge>
              </TableCell>
              <TableCell>
                <Badge>{classItem.trainer_id}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClassesListView;
