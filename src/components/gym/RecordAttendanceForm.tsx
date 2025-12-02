import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

const formSchema = z.object({
  date: z.string().min(1, "Date required"),
  class_id: z.string().min(1, "Class required"),
  member_id: z.string().min(1, "Member required"),
});

const RecordAttendanceForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { data: classes } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("class").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: members } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const { data, error } = await supabase.from("member").select("member_id, first, last");
      if (error) throw error;
      return data;
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      class_id: "",
      member_id: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // Verify class exists
      const { data: classData } = await supabase
        .from("class")
        .select("class_id")
        .eq("class_id", parseInt(values.class_id))
        .maybeSingle();

      if (!classData) {
        toast.error("Class not found");
        return;
      }

      // Verify member exists
      const { data: member } = await supabase
        .from("member")
        .select("member_id")
        .eq("member_id", parseInt(values.member_id))
        .maybeSingle();

      if (!member) {
        toast.error("Member not found");
        return;
      }

      // Check if attendance already recorded
      const { data: existingAttendance } = await supabase
        .from("attendance")
        .select("attendance_id")
        .eq("date", values.date)
        .eq("class_id", parseInt(values.class_id))
        .eq("member_id", parseInt(values.member_id))
        .maybeSingle();

      if (existingAttendance) {
        toast.error("Attendance already recorded for this date");
        return;
      }

      // Record attendance
      const { error } = await supabase
        .from("attendance")
        .insert({
          date: values.date,
          class_id: parseInt(values.class_id),
          member_id: parseInt(values.member_id),
        });

      if (error) throw error;

      toast.success("Attendance recorded successfully");
      form.reset();
    } catch (error: any) {
      toast.error(error.message || "Failed to record attendance");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="class_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {classes?.map((cls) => (
                    <SelectItem key={cls.class_id} value={cls.class_id.toString()}>
                      {cls.class_name} - {cls.schedule_time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="member_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Member</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select member" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {members?.map((member) => (
                    <SelectItem key={member.member_id} value={member.member_id.toString()}>
                      {member.first} {member.last} (ID: {member.member_id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Recording..." : "Record Attendance"}
        </Button>
      </form>
    </Form>
  );
};

export default RecordAttendanceForm;
