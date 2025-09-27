import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export function Results({ student }: { student: any }) {
  const [selectedSemester, setSelectedSemester] = useState<number>(student.semester);
  const [showAddResult, setShowAddResult] = useState(false);

  const results = useQuery(api.results.getStudentResults, {
    semester: selectedSemester,
  });

  const sgpa = useQuery(api.results.calculateSGPA, {
    semester: selectedSemester,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Academic Results</h1>
          <p className="text-slate-400">Track your grades and calculate SGPA/CGPA</p>
        </div>
        <button
          onClick={() => setShowAddResult(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Add Result
        </button>
      </div>

      {/* Semester Filter & SGPA */}
      <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
        <div className="flex justify-between items-center">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Select Semester</label>
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

          {sgpa && (
            <div className="text-right">
              <p className="text-sm text-slate-400">SGPA for Semester {selectedSemester}</p>
              <p className="text-3xl font-bold text-green-400">{sgpa}</p>
            </div>
          )}
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-200">Subject</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-200">Code</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-slate-200">Internal</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-slate-200">External</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-slate-200">Total</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-slate-200">Grade</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-slate-200">Credits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {results?.map((result) => (
                <tr key={result._id} className="hover:bg-slate-800/30">
                  <td className="px-6 py-4 text-slate-200">{result.subject}</td>
                  <td className="px-6 py-4 text-slate-300 font-mono text-sm">{result.subjectCode}</td>
                  <td className="px-6 py-4 text-center text-slate-200">{result.internalMarks || "-"}</td>
                  <td className="px-6 py-4 text-center text-slate-200">{result.externalMarks || "-"}</td>
                  <td className="px-6 py-4 text-center text-slate-200 font-semibold">{result.totalMarks || "-"}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded-md text-sm font-medium ${getGradeColor(result.grade)}`}>
                      {result.grade || "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-slate-200">{result.credits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {results?.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-medium text-slate-200 mb-2">No results found</h3>
            <p className="text-slate-400">Add your exam results to track your academic progress</p>
          </div>
        )}
      </div>

      {showAddResult && (
        <AddResultModal
          student={student}
          onClose={() => setShowAddResult(false)}
        />
      )}
    </div>
  );
}

function getGradeColor(grade?: string) {
  if (!grade) return "bg-slate-700 text-slate-300";
  
  switch (grade) {
    case "S":
    case "A+":
      return "bg-green-500/20 text-green-400";
    case "A":
    case "B+":
      return "bg-blue-500/20 text-blue-400";
    case "B":
    case "C":
      return "bg-yellow-500/20 text-yellow-400";
    case "P":
      return "bg-orange-500/20 text-orange-400";
    case "F":
      return "bg-red-500/20 text-red-400";
    default:
      return "bg-slate-700 text-slate-300";
  }
}

function AddResultModal({ student, onClose }: { student: any; onClose: () => void }) {
  const [formData, setFormData] = useState({
    semester: student.semester,
    subject: "",
    subjectCode: "",
    internalMarks: "",
    externalMarks: "",
    totalMarks: "",
    grade: "",
    credits: "",
    examType: "regular" as any,
    academicYear: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addResult = useMutation(api.results.addResult);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.subjectCode || !formData.credits || !formData.academicYear) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await addResult({
        semester: formData.semester,
        subject: formData.subject,
        subjectCode: formData.subjectCode,
        internalMarks: formData.internalMarks ? parseInt(formData.internalMarks) : undefined,
        externalMarks: formData.externalMarks ? parseInt(formData.externalMarks) : undefined,
        totalMarks: formData.totalMarks ? parseInt(formData.totalMarks) : undefined,
        grade: formData.grade || undefined,
        credits: parseInt(formData.credits),
        examType: formData.examType,
        academicYear: formData.academicYear,
      });

      toast.success("Result added successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to add result");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 rounded-xl p-6 w-full max-w-md border border-slate-800 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-100">Add Result</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Semester *
              </label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Academic Year *
              </label>
              <input
                type="text"
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                placeholder="e.g., 2023-24"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Subject Name *
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
              Subject Code *
            </label>
            <input
              type="text"
              value={formData.subjectCode}
              onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Internal Marks
              </label>
              <input
                type="number"
                value={formData.internalMarks}
                onChange={(e) => setFormData({ ...formData, internalMarks: e.target.value })}
                max="50"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                External Marks
              </label>
              <input
                type="number"
                value={formData.externalMarks}
                onChange={(e) => setFormData({ ...formData, externalMarks: e.target.value })}
                max="100"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Total Marks
              </label>
              <input
                type="number"
                value={formData.totalMarks}
                onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                max="150"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Grade
              </label>
              <select
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              >
                <option value="">Select Grade</option>
                <option value="S">S (10)</option>
                <option value="A+">A+ (9)</option>
                <option value="A">A (8)</option>
                <option value="B+">B+ (7)</option>
                <option value="B">B (6)</option>
                <option value="C">C (5)</option>
                <option value="P">P (4)</option>
                <option value="F">F (0)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Credits *
              </label>
              <input
                type="number"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                min="1"
                max="6"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Exam Type
            </label>
            <select
              value={formData.examType}
              onChange={(e) => setFormData({ ...formData, examType: e.target.value as any })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            >
              <option value="regular">Regular</option>
              <option value="revaluation">Revaluation</option>
              <option value="supplementary">Supplementary</option>
            </select>
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
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Adding..." : "Add Result"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
