import { Wrench } from 'lucide-react'

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-[#f4f4f0] dark:bg-[#1c1b19] flex flex-col items-center justify-center p-4">
      <div className="w-20 h-20 bg-[#c8ced8] rounded-full flex items-center justify-center mb-6">
        <Wrench className="w-10 h-10 text-[#42413b]" />
      </div>
      <h1 className="text-4xl font-bold text-[#42413b] dark:text-[#f4f4f0] mb-4 text-center tracking-tight">Under Maintenance</h1>
      <p className="text-lg text-[#a9a29e] text-center max-w-md">
        We are currently performing scheduled maintenance on the platform. Please check back later.
      </p>
    </div>
  )
}
