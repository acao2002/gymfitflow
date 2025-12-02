import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";

const formSchema = z.object({
  member_id: z.string().min(1, "Member ID required"),
  phone_number: z.string().min(10, "Valid phone required").max(20),
  email: z.string().email("Valid email required").max(255),
});

const UpdateMemberForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      member_id: "",
      phone_number: "",
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // Check if member exists
      const { data: member } = await supabase
        .from("member")
        .select("member_id")
        .eq("member_id", parseInt(values.member_id))
        .maybeSingle();

      if (!member) {
        toast.error("Member not found");
        return;
      }

      // Check if new phone/email already used by another member
      const { data: existingMember } = await supabase
        .from("member")
        .select("member_id")
        .neq("member_id", parseInt(values.member_id))
        .or(`phone_number.eq.${values.phone_number},email.eq.${values.email}`)
        .maybeSingle();

      if (existingMember) {
        toast.error("Phone or email already used by another member");
        return;
      }

      // Update member
      const { error } = await supabase
        .from("member")
        .update({
          phone_number: values.phone_number,
          email: values.email,
        })
        .eq("member_id", parseInt(values.member_id));

      if (error) throw error;

      toast.success("Member contact updated successfully");
      form.reset();
    } catch (error: any) {
      toast.error(error.message || "Failed to update member");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="member_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Member ID</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter member ID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Phone Number</FormLabel>
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
                <FormLabel>New Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="new.email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Updating..." : "Update Contact"}
        </Button>
      </form>
    </Form>
  );
};

export default UpdateMemberForm;
