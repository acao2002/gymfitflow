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
  first: z.string().min(1, "First name is required").max(100),
  middle: z.string().max(100).optional(),
  last: z.string().min(1, "Last name is required").max(100),
  phone_number: z.string().min(10, "Valid phone required").max(20),
  email: z.string().email("Valid email required").max(255),
  join_date: z.string(),
  trainer_id: z.string().optional(),
  membership_id: z.string().min(1, "Membership plan required"),
});

const AddMemberForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { data: trainers } = useQuery({
    queryKey: ["trainers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("trainer").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: memberships } = useQuery({
    queryKey: ["memberships"],
    queryFn: async () => {
      const { data, error } = await supabase.from("membership").select("*");
      if (error) throw error;
      return data;
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first: "",
      middle: "",
      last: "",
      phone_number: "",
      email: "",
      join_date: new Date().toISOString().split("T")[0],
      trainer_id: "",
      membership_id: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // Check if phone/email already exists
      const { data: existingMember } = await supabase
        .from("member")
        .select("member_id")
        .or(`phone_number.eq.${values.phone_number},email.eq.${values.email}`)
        .maybeSingle();

      if (existingMember) {
        toast.error("Phone or email already in use");
        return;
      }

      // Verify trainer exists if provided
      if (values.trainer_id) {
        const { data: trainer } = await supabase
          .from("trainer")
          .select("trainer_id")
          .eq("trainer_id", parseInt(values.trainer_id))
          .maybeSingle();

        if (!trainer) {
          toast.error("Trainer not found");
          return;
        }
      }

      // Verify membership exists
      const { data: membership } = await supabase
        .from("membership")
        .select("plan_id")
        .eq("plan_id", parseInt(values.membership_id))
        .maybeSingle();

      if (!membership) {
        toast.error("Membership plan not found");
        return;
      }

      // Insert member
      const { data, error } = await supabase
        .from("member")
        .insert({
          first: values.first,
          middle: values.middle || null,
          last: values.last,
          phone_number: values.phone_number,
          email: values.email,
          join_date: values.join_date,
          trainer_id: values.trainer_id ? parseInt(values.trainer_id) : null,
          membership_id: parseInt(values.membership_id),
        })
        .select()
        .single();

      if (error) throw error;

      toast.success(`Member added successfully! ID: ${data.member_id}`);
      form.reset();
    } catch (error: any) {
      toast.error(error.message || "Failed to add member");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="first"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="middle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Middle Name</FormLabel>
                <FormControl>
                  <Input placeholder="M" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="555-0123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john.doe@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="join_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Join Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="trainer_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trainer (Optional)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select trainer" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {trainers?.map((trainer) => (
                      <SelectItem key={trainer.trainer_id} value={trainer.trainer_id.toString()}>
                        {trainer.first} {trainer.last}
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
            name="membership_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Membership Plan</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select plan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {memberships?.map((plan) => (
                      <SelectItem key={plan.plan_id} value={plan.plan_id.toString()}>
                        {plan.plan_name} ({plan.duration_months} months)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90">
          {isLoading ? "Adding..." : "Add Member"}
        </Button>
      </form>
    </Form>
  );
};

export default AddMemberForm;
