import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, User } from "lucide-react";

interface ScheduleItem {
  class_id: number;
  class_name: string;
  schedule_time: string;
  trainer_first: string;
  trainer_last: string;
}

const MemberScheduleView = () => {
  const [memberId, setMemberId] = useState("");
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSchedule = async () => {
    if (!memberId) {
      toast.error("Please enter member ID");
      return;
    }

    setIsLoading(true);
    try {
      // Verify member exists
      const { data: member } = await supabase
        .from("member")
        .select("member_id, first, last")
        .eq("member_id", parseInt(memberId))
        .maybeSingle();

      if (!member) {
        toast.error("Member not found");
        return;
      }

      // Use the member_schedule function which joins member, takeclass, class, and trainer tables
      const { data, error } = await supabase.rpc("member_schedule", {
        p_member_id: parseInt(memberId),
      });

      if (error) throw error;

      if (!data || data.length === 0) {
        setSchedule([]);
        toast.info(`${member.first} ${member.last} is not enrolled in any classes`);
        return;
      }

      const scheduleItems: ScheduleItem[] = data.map((row: any) => ({
        class_id: row.class_id,
        class_name: row.class_name,
        schedule_time: row.schedule_time,
        trainer_first: row.trainer_first,
        trainer_last: row.trainer_last,
      }));

      setSchedule(scheduleItems);
      toast.success(`Schedule loaded for ${member.first} ${member.last}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch schedule");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <Label htmlFor="memberId">Member ID</Label>
          <Input
            id="memberId"
            type="number"
            placeholder="Enter member ID"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
          />
        </div>
        <div className="self-end">
          <Button onClick={fetchSchedule} disabled={isLoading}>
            {isLoading ? "Loading..." : "View Schedule"}
          </Button>
        </div>
      </div>

      {schedule.length > 0 && (
        <div className="grid gap-4 mt-6">
          {schedule.map((item) => (
            <Card key={item.class_id} className="border-l-4 border-l-primary">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Class</p>
                      <p className="font-semibold">{item.class_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-secondary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Schedule</p>
                      <p className="font-semibold">{item.schedule_time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-accent" />
                    <div>
                      <p className="text-sm text-muted-foreground">Trainer</p>
                      <p className="font-semibold">{item.trainer_first} {item.trainer_last}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {schedule.length === 0 && memberId && !isLoading && (
        <div className="text-center py-8 text-muted-foreground">
          No classes found for this member
        </div>
      )}
    </div>
  );
};

export default MemberScheduleView;
