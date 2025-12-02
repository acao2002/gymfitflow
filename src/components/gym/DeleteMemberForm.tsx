import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const formSchema = z.object({
  member_id: z.string().min(1, "Member ID required"),
});

const DeleteMemberForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      member_id: "",
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

      // Delete cascades automatically via ON DELETE CASCADE
      // Deletes from: attendance, take, train tables
      const { error } = await supabase
        .from("member")
        .delete()
        .eq("member_id", parseInt(values.member_id));

      if (error) throw error;

      toast.success("Member and all associated records deleted successfully");
      form.reset();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete member");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Warning: This will permanently delete the member and all associated attendance, class enrollments, and trainer assignments.
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="member_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Member ID</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter member ID to delete" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading} variant="destructive" className="w-full">
            {isLoading ? "Deleting..." : "Delete Member"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default DeleteMemberForm;
