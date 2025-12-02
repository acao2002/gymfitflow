import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell } from "lucide-react";
import AddMemberForm from "@/components/gym/AddMemberForm";
import UpdateMemberForm from "@/components/gym/UpdateMemberForm";
import DeleteMemberForm from "@/components/gym/DeleteMemberForm";
import TakeClassForm from "@/components/gym/TakeClassForm";
import RecordAttendanceForm from "@/components/gym/RecordAttendanceForm";
import MemberScheduleView from "@/components/gym/MemberScheduleView";
import ClassFillRateView from "@/components/gym/ClassFillRateView";
import AssignTrainerForm from "@/components/gym/AssignTrainerForm";
import MembersListView from "@/components/gym/MembersListView";
import TrainersListView from "@/components/gym/TrainersListView";
import ClassesListView from "@/components/gym/ClassesListView";
import MembershipsListView from "@/components/gym/MembershipsListView";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-xl">
            <Dumbbell className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              FitFlow Gym Management
            </h1>
            <p className="text-muted-foreground">Complete gym operations system</p>
          </div>
        </div>

        <Tabs defaultValue="view-members" className="space-y-6">
          <TabsList className="grid grid-cols-3 lg:grid-cols-6 gap-2 h-auto p-2 bg-card">
            <TabsTrigger value="view-members" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              📋 Members
            </TabsTrigger>
            <TabsTrigger value="view-trainers" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              💪 Trainers
            </TabsTrigger>
            <TabsTrigger value="view-classes" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              🏋️ Classes
            </TabsTrigger>
            <TabsTrigger value="view-memberships" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              🎫 Memberships
            </TabsTrigger>
            <TabsTrigger value="fill-rate" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              📊 Fill Rate
            </TabsTrigger>
            <TabsTrigger value="schedule" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              📅 Schedule
            </TabsTrigger>
            <TabsTrigger value="add-member" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
              ➕ Add Member
            </TabsTrigger>
            <TabsTrigger value="update-member" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
              ✏️ Update
            </TabsTrigger>
            <TabsTrigger value="delete-member" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
              🗑️ Delete
            </TabsTrigger>
            <TabsTrigger value="take-class" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
              📝 Enroll
            </TabsTrigger>
            <TabsTrigger value="attendance" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
              ✅ Attendance
            </TabsTrigger>
            <TabsTrigger value="assign-trainer" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
              👤 Assign PT
            </TabsTrigger>
          </TabsList>

          <TabsContent value="view-members">
            <Card>
              <CardHeader>
                <CardTitle>All Members</CardTitle>
                <CardDescription>View all registered gym members</CardDescription>
              </CardHeader>
              <CardContent>
                <MembersListView />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="view-trainers">
            <Card>
              <CardHeader>
                <CardTitle>All Trainers</CardTitle>
                <CardDescription>View all personal and group trainers</CardDescription>
              </CardHeader>
              <CardContent>
                <TrainersListView />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="view-classes">
            <Card>
              <CardHeader>
                <CardTitle>All Classes</CardTitle>
                <CardDescription>View all available fitness classes</CardDescription>
              </CardHeader>
              <CardContent>
                <ClassesListView />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="view-memberships">
            <Card>
              <CardHeader>
                <CardTitle>Membership Plans</CardTitle>
                <CardDescription>View all available membership plans</CardDescription>
              </CardHeader>
              <CardContent>
                <MembershipsListView />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add-member">
            <Card>
              <CardHeader>
                <CardTitle>Add New Member</CardTitle>
                <CardDescription>Register a new gym member with membership plan</CardDescription>
              </CardHeader>
              <CardContent>
                <AddMemberForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="update-member">
            <Card>
              <CardHeader>
                <CardTitle>Update Member Contact</CardTitle>
                <CardDescription>Modify member phone and email information</CardDescription>
              </CardHeader>
              <CardContent>
                <UpdateMemberForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="delete-member">
            <Card>
              <CardHeader>
                <CardTitle>Delete Member</CardTitle>
                <CardDescription>Remove member and all associated records</CardDescription>
              </CardHeader>
              <CardContent>
                <DeleteMemberForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="take-class">
            <Card>
              <CardHeader>
                <CardTitle>Enroll in Class</CardTitle>
                <CardDescription>Register member for a class with capacity validation</CardDescription>
              </CardHeader>
              <CardContent>
                <TakeClassForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <CardTitle>Record Attendance</CardTitle>
                <CardDescription>Mark member attendance for class sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <RecordAttendanceForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fill-rate">
            <Card>
              <CardHeader>
                <CardTitle>Class Fill Rate Analytics</CardTitle>
                <CardDescription>View enrollment statistics for all classes</CardDescription>
              </CardHeader>
              <CardContent>
                <ClassFillRateView />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>Member Schedule</CardTitle>
                <CardDescription>View all classes enrolled by a member</CardDescription>
              </CardHeader>
              <CardContent>
                <MemberScheduleView />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assign-trainer">
            <Card>
              <CardHeader>
                <CardTitle>Assign Personal Trainer</CardTitle>
                <CardDescription>Link a personal trainer to a member</CardDescription>
              </CardHeader>
              <CardContent>
                <AssignTrainerForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
