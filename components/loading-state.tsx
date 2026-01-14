import { Loader2 } from "lucide-react"

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-5rem)] gap-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">Analyzing Lecture and Generating Blueprint...</h2>
        <p className="text-sm text-muted-foreground">This will take just a moment</p>
      </div>
    </div>
  )
}
