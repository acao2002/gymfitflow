import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type Member = {
  member_id: number;
  first: string;
  middle: string | null;
  last: string;
  phone_number: string;
  email: string;
  join_date: string;
  trainer_id: number | null;
  membership_id: number;
};

const MembersListView = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("member")
        .select("*")
        .order("member_id", { ascending: true });

      if (error) throw error;
      setMembers(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch members", {
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

  if (members.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No members found in the database.
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
            <TableHead>Trainer ID</TableHead>
            <TableHead>Membership</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.member_id}>
              <TableCell className="font-medium">{member.member_id}</TableCell>
              <TableCell>
                {member.first} {member.middle && `${member.middle} `}{member.last}
              </TableCell>
              <TableCell>{member.phone_number}</TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>{new Date(member.join_date).toLocaleDateString()}</TableCell>
              <TableCell>
                {member.trainer_id ? (
                  <Badge variant="secondary">{member.trainer_id}</Badge>
                ) : (
                  <span className="text-muted-foreground">None</span>
                )}
              </TableCell>
              <TableCell>
                <Badge>{member.membership_id}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MembersListView;
