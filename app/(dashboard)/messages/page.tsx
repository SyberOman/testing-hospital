import { MessagesView } from "@/components/messages-view"

export default function MessagesPage() {
  return (
    <div className="p-6 w-full h-full">
      <h1 className="text-2xl font-bold mb-6">Department Messages</h1>
      <MessagesView />
    </div>
  )
}

