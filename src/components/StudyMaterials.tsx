import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

const materialTypes = [
  { value: "notes", label: "Notes", icon: "📝" },
  { value: "question_paper", label: "Question Papers", icon: "❓" },
  { value: "syllabus", label: "Syllabus", icon: "📋" },
  { value: "lab_manual", label: "Lab Manuals", icon: "🔬" },
];

export function StudyMaterials({ student }: { student: any }) {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedSemester, setSelectedSemester] = useState<number>(student.semester);
  const [showUpload, setShowUpload] = useState(false);

  const materials = useQuery(api.studyMaterials.getMaterials, {
    branch: student.branch,
    semester: selectedSemester,
    type: selectedType === "all" ? undefined : selectedType as any,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Study Materials</h1>
          <p className="text-slate-400">Access notes, papers, and resources for your courses</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Upload Material
        </button>
      </div>

      {/* Filters */}
      <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Material Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            >
              <option value="all">All Types</option>
              {materialTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Semester</label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(parseInt(e.target.value))}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials?.map((material) => (
          <MaterialCard key={material._id} material={material} />
        ))}
      </div>

      {materials?.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📚</span>
          </div>
          <h3 className="text-lg font-medium text-slate-200 mb-2">No materials found</h3>
          <p className="text-slate-400">Try adjusting your filters or upload some materials</p>
        </div>
      )}

      {showUpload && (
        <UploadModal
          student={student}
          onClose={() => setShowUpload(false)}
        />
      )}
    </div>
  );
}

function MaterialCard({ material }: { material: any }) {
  const incrementDownload = useMutation(api.studyMaterials.incrementDownload);

  const handleDownload = async () => {
    if (material.fileUrl) {
      await incrementDownload({ materialId: material._id });
      window.open(material.fileUrl, '_blank');
    }
  };

  const typeInfo = materialTypes.find(t => t.value === material.type);

  return (
    <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 hover:border-slate-700 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <span className="text-lg">{typeInfo?.icon || "📄"}</span>
          </div>
          <div>
            <h3 className="font-semibold text-slate-100">{material.title}</h3>
            <p className="text-sm text-slate-400">{material.subject}</p>
          </div>
        </div>
      </div>

      {material.description && (
        <p className="text-sm text-slate-300 mb-4">{material.description}</p>
      )}

      <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
        <span>Semester {material.semester}</span>
        <span>{material.downloadCount || 0} downloads</span>
      </div>

      {material.tags && material.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {material.tags.map((tag: string, index: number) => (
            <span
              key={index}
              className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <button
        onClick={handleDownload}
        disabled={!material.fileUrl}
        className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {material.fileUrl ? "Download" : "File not available"}
      </button>
    </div>
  );
}

function UploadModal({ student, onClose }: { student: any; onClose: () => void }) {
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    type: "notes" as any,
    description: "",
    tags: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const generateUploadUrl = useMutation(api.studyMaterials.generateUploadUrl);
  const uploadMaterial = useMutation(api.studyMaterials.uploadMaterial);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !formData.title || !formData.subject) {
      toast.error("Please fill in all required fields and select a file");
      return;
    }

    setIsUploading(true);
    try {
      // Get upload URL
      const uploadUrl = await generateUploadUrl();

      // Upload file
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!result.ok) {
        throw new Error("Failed to upload file");
      }

      const { storageId } = await result.json();

      // Save material info
      await uploadMaterial({
        title: formData.title,
        subject: formData.subject,
        branch: student.branch,
        semester: student.semester,
        type: formData.type,
        fileId: storageId,
        description: formData.description || undefined,
        tags: formData.tags ? formData.tags.split(",").map(tag => tag.trim()) : undefined,
      });

      toast.success("Material uploaded successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to upload material");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 rounded-xl p-6 w-full max-w-md border border-slate-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-100">Upload Material</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Subject *
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            >
              {materialTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              File *
            </label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              accept=".pdf,.doc,.docx,.ppt,.pptx"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="e.g., important, midterm, unit1"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
