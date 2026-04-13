import Scene1 from "@/components/cinematic/Scene1"
import Scene2 from "@/components/cinematic/Scene2"
import Scene3 from "@/components/cinematic/Scene3"
import Scene4 from "@/components/cinematic/Scene4"

export default function Page() {
  return (
    <main className="bg-background text-foreground overflow-x-hidden">
      <Scene1 />
      <Scene2 />
      <Scene3 />
      <Scene4 />
    </main>
  )
}
