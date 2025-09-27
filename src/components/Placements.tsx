import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

type PlacementStatus = "upcoming" | "ongoing" | "completed" | "all";

export function Placements({ student }: { student: any }) {
  const [selectedStatus, setSelectedStatus] = useState<PlacementStatus>("upcoming");

  const placements = useQuery(api.placements.getPlacements, {
    status: selectedStatus === "all" ? undefined : selectedStatus,
  });

  const eligiblePlacements = useQuery(api.placements.getEligiblePlacements);

  const statusOptions = [
    { value: "upcoming" as PlacementStatus, label: "Upcoming", icon: "🔜" },
    { value: "ongoing" as PlacementStatus, label: "Ongoing", icon: "⏳" },
    { value: "completed" as PlacementStatus, label: "Completed", icon: "✅" },
    { value: "all" as PlacementStatus, label: "All", icon: "📋" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Placement Opportunities</h1>
        <p className="text-slate-400">Discover job opportunities and placement drives</p>
      </div>

      {/* Eligible Placements Alert */}
      {eligiblePlacements && eligiblePlacements.length > 0 && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
              <span className="text-green-400">🎯</span>
            </div>
            <div>
              <h3 className="font-semibold text-green-400">You're Eligible!</h3>
              <p className="text-sm text-green-300">
                {eligiblePlacements.length} placement{eligiblePlacements.length > 1 ? 's' : ''} match your profile
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Status Filter */}
      <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
        <div className="flex flex-wrap gap-3">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedStatus(option.value)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedStatus === option.value
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  : "bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <span>{option.icon}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Placements Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {placements?.map((placement) => (
          <PlacementCard
            key={placement._id}
            placement={placement}
            isEligible={eligiblePlacements?.some(ep => ep._id === placement._id)}
            student={student}
          />
        ))}
      </div>

      {placements?.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">💼</span>
          </div>
          <h3 className="text-lg font-medium text-slate-200 mb-2">No placements found</h3>
          <p className="text-slate-400">Check back later for new opportunities</p>
        </div>
      )}
    </div>
  );
}

function PlacementCard({ placement, isEligible, student }: { 
  placement: any; 
  isEligible?: boolean;
  student: any;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-500/20 text-blue-400";
      case "ongoing":
        return "bg-yellow-500/20 text-yellow-400";
      case "completed":
        return "bg-green-500/20 text-green-400";
      default:
        return "bg-slate-500/20 text-slate-400";
    }
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "TBD";
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className={`bg-slate-900/50 rounded-xl p-6 border transition-colors ${
      isEligible ? "border-green-500/30 bg-green-500/5" : "border-slate-800 hover:border-slate-700"
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">{placement.companyName}</h3>
          <p className="text-slate-300">{placement.role}</p>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(placement.status)}`}>
            {placement.status}
          </span>
          {isEligible && (
            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-md font-medium">
              Eligible
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {placement.package && (
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 text-sm">💰</span>
            <span className="text-slate-200 font-medium">{placement.package}</span>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <span className="text-slate-400 text-sm">🎓</span>
          <span className="text-slate-300 text-sm">
            {placement.eligibleBranches.join(", ")}
          </span>
        </div>

        {placement.cgpaCriteria && (
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 text-sm">📊</span>
            <span className="text-slate-300 text-sm">
              Min CGPA: {placement.cgpaCriteria}
            </span>
          </div>
        )}

        {placement.applicationDeadline && (
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 text-sm">⏰</span>
            <span className="text-slate-300 text-sm">
              Apply by: {formatDate(placement.applicationDeadline)}
            </span>
          </div>
        )}

        {placement.driveDate && (
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 text-sm">📅</span>
            <span className="text-slate-300 text-sm">
              Drive Date: {formatDate(placement.driveDate)}
            </span>
          </div>
        )}
      </div>

      <p className="text-slate-300 text-sm mb-4 line-clamp-3">
        {placement.description}
      </p>

      {placement.requirements && placement.requirements.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-slate-200 mb-2">Requirements:</h4>
          <div className="flex flex-wrap gap-2">
            {placement.requirements.map((req: string, index: number) => (
              <span
                key={index}
                className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded-md"
              >
                {req}
              </span>
            ))}
          </div>
        </div>
      )}

      {placement.contactInfo && (
        <div className="text-sm text-slate-400 mb-4">
          <span className="font-medium">Contact:</span> {placement.contactInfo}
        </div>
      )}

      <div className="flex space-x-3">
        <button
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            isEligible
              ? "bg-green-500/20 hover:bg-green-500/30 text-green-400"
              : "bg-blue-500/20 hover:bg-blue-500/30 text-blue-400"
          }`}
        >
          {placement.status === "upcoming" ? "Apply Now" : "View Details"}
        </button>
        <button className="px-4 py-2 bg-slate-800/50 hover:bg-slate-800 text-slate-300 rounded-lg font-medium transition-colors">
          Share
        </button>
      </div>
    </div>
  );
}
