"use client"

import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DepartmentList } from "@/components/departments/department-list"
import { MeetingRoomCard } from "@/components/meeting/meeting-room-card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Plus } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useDepartmentStore } from "@/lib/stores/department-store"
import { useToast } from "@/hooks/use-toast"

export default function MainRoomPage() {
  const router = useRouter()
  const { departments, clearSelectedDepartments } = useDepartmentStore()
  const { toast } = useToast()

  const handleRestartOnboarding = () => {
    clearSelectedDepartments()
    sessionStorage.setItem('resetting-departments', 'true')
    toast({
      title: "Onboarding Restarted",
      description: "You can now select your AI departments again."
    })
    router.push('/setup')
  }

  return (
    <div>
      <DashboardHeader />
      <main className="container py-6">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Main Room</h1>
            <p className="text-muted-foreground">
              Your central hub for managing AI departments
            </p>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => router.push('/setup/add-department')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Department
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset Department Setup
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset Department Setup?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will take you back to the department selection process. Your existing departments will remain until you complete the new setup.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleRestartOnboarding}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="space-y-8">
          <MeetingRoomCard />
          <DepartmentList />
        </div>
      </main>
    </div>
  )
}