import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type Trainer = {
  trainer_id: number;
  first: string;
  middle: string | null;
  last: string;
  phone_number: string;
  email: string;
  join_date: string;
  hourly_rate: number;
  rating: number | null;
};

type TrainerType = {
  trainer_id: number;
  type: "Personal" | "Group";
  max_value: number;
};

const TrainersListView = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [trainerTypes, setTrainerTypes] = useState<Map<number, TrainerType>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    setLoading(true);
    try {
      const { data: trainersData, error: trainersError } = await supabase
        .from("trainer")
        .select("*")
        .order("trainer_id", { ascending: true });

      if (trainersError) throw trainersError;

      const { data: personalData, error: personalError } = await supabase
        .from("personal_trainer")
        .select("*");

      if (personalError) throw personalError;

      const { data: groupData, error: groupError } = await supabase
        .from("group_trainer")
        .select("*");

      if (groupError) throw groupError;

      const typesMap = new Map<number, TrainerType>();
      personalData?.forEach((pt) => {
        typesMap.set(pt.trainer_id, {
          trainer_id: pt.trainer_id,
          type: "Personal",
          max_value: pt.max_members,
        });
      });
      groupData?.forEach((gt) => {
        typesMap.set(gt.trainer_id, {
          trainer_id: gt.trainer_id,
          type: "Group",
          max_value: gt.max_classes,
        });
      });

      setTrainers(trainersData || []);
      setTrainerTypes(typesMap);
    } catch (error: any) {
      toast.error("Failed to fetch trainers", {
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

  if (trainers.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No trainers found in the database.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Join Date</TableHead>
            <TableHead>Rate ($/hr)</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Limit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trainers.map((trainer) => {
            const trainerType = trainerTypes.get(trainer.trainer_id);
            return (
              <TableRow key={trainer.trainer_id}>
                <TableCell className="font-medium">{trainer.trainer_id}</TableCell>
                <TableCell>
                  {trainer.first} {trainer.middle && `${trainer.middle} `}{trainer.last}
                </TableCell>
                <TableCell>{trainer.phone_number}</TableCell>
                <TableCell>{trainer.email}</TableCell>
                <TableCell>{new Date(trainer.join_date).toLocaleDateString()}</TableCell>
                <TableCell>${trainer.hourly_rate.toFixed(2)}</TableCell>
                <TableCell>
                  {trainer.rating ? (
                    <Badge variant="secondary">{trainer.rating} ⭐</Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {trainerType ? (
                    <Badge variant={trainerType.type === "Personal" ? "default" : "outline"}>
                      {trainerType.type}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {trainerType && (
                    <span className="text-sm text-muted-foreground">
                      {trainerType.type === "Personal" 
                        ? `${trainerType.max_value} members` 
                        : `${trainerType.max_value} classes`}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default TrainersListView;
