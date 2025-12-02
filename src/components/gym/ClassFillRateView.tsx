import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, TrendingUp } from "lucide-react";

interface FillRateData {
  class_id: number;
  class_name: string;
  schedule_time: string;
  enrolled: number;
  max_capacity: number;
  fill_percent: number;
}

const ClassFillRateView = () => {
  const [fillRates, setFillRates] = useState<FillRateData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFillRates();
  }, []);

  const fetchFillRates = async () => {
    setIsLoading(true);
    try {
      // Use the class_fill_rate view which joins class and takeclass tables
      // and aggregates enrollment data with COUNT function
      const { data, error } = await supabase
        .from("class_fill_rate")
        .select("*")
        .order("schedule_time");

      if (error) throw error;

      const fillRateData: FillRateData[] = (data || []).map((row) => ({
        class_id: row.class_id || 0,
        class_name: row.class_name || "",
        schedule_time: row.schedule_time || "",
        enrolled: Number(row.enrolled) || 0,
        max_capacity: row.max_capacity || 0,
        fill_percent: Math.round(Number(row.fill_percent) || 0),
      }));

      setFillRates(fillRateData);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch class fill rates");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading class statistics...</div>;
  }

  return (
    <div className="space-y-4">
      {fillRates.map((data) => (
        <Card key={data.class_id} className="overflow-hidden">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{data.class_name}</h3>
                  <p className="text-sm text-muted-foreground">{data.schedule_time}</p>
                </div>
                <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-primary">{data.fill_percent}%</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Enrollment</span>
                  </div>
                  <span className="font-semibold">
                    {data.enrolled} / {data.max_capacity}
                  </span>
                </div>
                <Progress value={data.fill_percent} className="h-2" />
              </div>

              <div className="flex gap-2 text-xs">
                {data.fill_percent >= 100 ? (
                  <span className="bg-destructive/10 text-destructive px-2 py-1 rounded">Full</span>
                ) : data.fill_percent >= 80 ? (
                  <span className="bg-accent/20 text-accent-foreground px-2 py-1 rounded">Almost Full</span>
                ) : data.fill_percent >= 50 ? (
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded">Good Attendance</span>
                ) : (
                  <span className="bg-muted text-muted-foreground px-2 py-1 rounded">Available Spots</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {fillRates.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No classes available
        </div>
      )}
    </div>
  );
};

export default ClassFillRateView;
