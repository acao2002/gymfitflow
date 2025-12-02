import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type Membership = {
  plan_id: number;
  plan_name: string;
  duration_months: number;
};

const MembershipsListView = () => {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMemberships();
  }, []);

  const fetchMemberships = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("membership")
        .select("*")
        .order("plan_id", { ascending: true });

      if (error) throw error;
      setMemberships(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch memberships", {
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

  if (memberships.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No membership plans found in the database.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Plan ID</TableHead>
            <TableHead>Plan Name</TableHead>
            <TableHead>Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {memberships.map((membership) => (
            <TableRow key={membership.plan_id}>
              <TableCell className="font-medium">{membership.plan_id}</TableCell>
              <TableCell className="font-semibold">{membership.plan_name}</TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {membership.duration_months} {membership.duration_months === 1 ? "month" : "months"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MembershipsListView;
