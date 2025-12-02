import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

const formSchema = z.object({
  trainer_id: z.string().min(1, "Personal trainer required"),
  member_id: z.string().min(1, "Member required"),
});

const AssignTrainerForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { data: personalTrainers } = useQuery({
    queryKey: ["personal-trainers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("personal_trainer")
        .select("trainer_id, max_members, trainer:trainer_id(first, last, email)");
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
      trainer_id: "",
      member_id: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // Verify trainer exists in personal_trainer
      const { data: trainer } = await supabase
        .from("personal_trainer")
        .select("trainer_id, max_members")
        .eq("trainer_id", parseInt(values.trainer_id))
        .maybeSingle();

      if (!trainer) {
        toast.error("Personal trainer not found");
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

      // Check if already assigned
      const { data: existingAssignment } = await supabase
        .from("train")
        .select("trainer_id")
        .eq("trainer_id", parseInt(values.trainer_id))
        .eq("member_id", parseInt(values.member_id))
        .maybeSingle();

      if (existingAssignment) {
        toast.error("Trainer already assigned to this member");
        return;
      }

      // Check max members limit
      const { count } = await supabase
        .from("train")
        .select("*", { count: "exact", head: true })
        .eq("trainer_id", parseInt(values.trainer_id));

      if (count !== null && count >= trainer.max_members) {
        toast.error(`Trainer has reached maximum capacity (${trainer.max_members} members)`);
        return;
      }

      // Assign trainer
      const { error } = await supabase
        .from("train")
        .insert({
          trainer_id: parseInt(values.trainer_id),
          member_id: parseInt(values.member_id),
        });

      if (error) throw error;

      toast.success("Personal trainer assigned successfully");
      form.reset();
    } catch (error: any) {
      toast.error(error.message || "Failed to assign trainer");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="trainer_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Personal Trainer</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select personal trainer" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {personalTrainers?.map((pt) => (
                    <SelectItem key={pt.trainer_id} value={pt.trainer_id.toString()}>
                      {pt.trainer?.first} {pt.trainer?.last} (Max: {pt.max_members})
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
          {isLoading ? "Assigning..." : "Assign Personal Trainer"}
        </Button>
      </form>
    </Form>
  );
};

export default AssignTrainerForm;
