import { db } from '@/lib/db'
import Link from 'next/link'
import { BookOpen, Search, ArrowRight, Sparkles, AlertCircle } from 'lucide-react'
import { PublicResourceDownloader } from '@/components/student/PublicResourceDownloader'

interface PageProps {
  searchParams: Promise<{
    semester?: string
    subject?: string
    branch?: string
    type?: string
    search?: string
    scheme?: string
  }>
}

export const dynamic = 'force-dynamic'

export default async function PublicResourcesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const semester = params.semester
  const branch = params.branch
  const type = params.type
  const search = params.search
  const scheme = params.scheme

  // Build DB query filter
  const where: any = {
    is_approved: true,
    is_public: true,
    is_library: false
  }

  if (semester) where.semester = parseInt(semester)
  if (branch) where.branch = branch
  if (scheme) where.scheme = scheme
  if (type) where.type = type
  
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { subject: { contains: search, mode: 'insensitive' } }
    ]
  }

  // Fetch from Prisma DB directly on the server
  const resources = await db.resources.findMany({
    where,
    include: {
      users: {
        select: {
          user_profiles: {
            select: {
              first_name: true,
              last_name: true
            }
          }
        }
      }
    },
    orderBy: { created_at: 'desc' }
  })

  // Format uploader name
  const formattedResources = resources.map(r => ({
    id: r.id,
    title: r.title,
    description: r.description || 'No description available.',
    fileName: r.fileName,
    fileSize: r.fileSize,
    type: r.type,
    uploadedBy: r.users?.user_profiles 
      ? `${r.users.user_profiles.first_name} ${r.users.user_profiles.last_name}` 
      : 'Verified Mentor',
    createdAt: r.created_at,
    semester: r.semester,
    subject: r.subject,
    branch: r.branch || 'General',
    unit: r.unit || 'All Units',
    scheme: r.scheme || '2022',
    moduleNumber: r.module_number
  }))

  // Available VTU branches for filters
  const branches = ['CSE', 'ISE', 'ECE', 'EEE', 'ME', 'CIV', 'AI&DS']
  // Resource types
  const types = ['NOTES', 'QUESTION_BANK', 'MODEL_PAPER', 'SYLLABUS']

  return (
    <div className="min-h-screen bg-[#FDFBF9] font-sans antialiased text-[#1E1E1E]">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500;600;700;900&display=swap');
      `}} />

      {/* Global Header Bar */}
      <nav className="h-16 px-6 lg:px-12 flex items-center justify-between border-b border-[#dfd3c3]/40 bg-white/70 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="LearnWave Logo" className="w-8 h-8 object-contain rounded-lg" />
          <span className="text-2xl font-extrabold tracking-tight">
            <span className="text-[#25559C]">Learn</span>
            <span className="text-[#7DBA45]">Wave</span>
          </span>
        </Link>
        <ul className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#8A919B]">
          <li><Link href="/#features" className="hover:text-[#1E1E1E] transition-colors">Features</Link></li>
          <li><Link href="/#roles" className="hover:text-[#1E1E1E] transition-colors">For You</Link></li>
          <li><Link href="#" className="hover:text-[#1E1E1E] transition-colors">Docs</Link></li>
        </ul>
        <div className="flex items-center gap-4">
          <Link href="/auth/login" className="text-sm font-bold text-[#8A919B] hover:text-[#1E1E1E] transition-colors">
            Sign In
          </Link>
          <Link href="/auth/register">
            <button className="px-5 py-2.5 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer">
              <span>Get Started Free</span>
              <ArrowRight size={14} />
            </button>
          </Link>
        </div>
      </nav>

      {/* Main Hero & Content Section */}
      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        
        {/* Header Title */}
        <div className="mb-12 text-center md:text-left">
          <span className="px-3 py-1 bg-[#4f46e5]/10 text-[#4f46e5] rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block">
            Free Study Material
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#1E1E1E] font-['Outfit'] mb-4">
            Browse Academic Resources
          </h1>
          <p className="text-base md:text-lg text-[#8A919B] max-w-2xl font-light">
            Access free approved notes, question banks, and VTU syllabus files. Sign up to unlock interactive quizzes, AI assistant tutoring, and mentor bookings.
          </p>
        </div>

        {/* 2-Column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Left Column: Filter Sidebar */}
          <div className="lg:col-span-1 bg-white border border-[#dfd3c3]/50 rounded-[2rem] p-6 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold text-[#1E1E1E] mb-6 font-['Outfit'] flex items-center gap-2">
              <Search size={18} className="text-[#8A919B]" />
              <span>Search Filters</span>
            </h2>
            
            <form action="/resources" method="GET" className="space-y-5">
              
              {/* Search query */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#8A919B]">Keyword</label>
                <input
                  type="text"
                  name="search"
                  defaultValue={search || ''}
                  placeholder="e.g. Data Structures..."
                  className="w-full px-3 py-2.5 bg-[#FDFBF9] border border-[#DDE3EA] rounded-xl text-sm outline-none focus:border-[#1E1E1E] placeholder-[#B0B7BF]"
                />
              </div>

              {/* Branch */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#8A919B]">Branch</label>
                <select
                  name="branch"
                  defaultValue={branch || ''}
                  className="w-full px-3 py-2.5 bg-[#FDFBF9] border border-[#DDE3EA] rounded-xl text-sm outline-none focus:border-[#1E1E1E]"
                >
                  <option value="">All Branches</option>
                  {branches.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* Semester */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#8A919B]">Semester</label>
                <select
                  name="semester"
                  defaultValue={semester || ''}
                  className="w-full px-3 py-2.5 bg-[#FDFBF9] border border-[#DDE3EA] rounded-xl text-sm outline-none focus:border-[#1E1E1E]"
                >
                  <option value="">All Semesters</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                    <option key={s} value={s.toString()}>Semester {s}</option>
                  ))}
                </select>
              </div>

              {/* Scheme */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#8A919B]">Scheme</label>
                <select
                  name="scheme"
                  defaultValue={scheme || ''}
                  className="w-full px-3 py-2.5 bg-[#FDFBF9] border border-[#DDE3EA] rounded-xl text-sm outline-none focus:border-[#1E1E1E]"
                >
                  <option value="">All Schemes</option>
                  <option value="2018">2018 Scheme</option>
                  <option value="2021">2021 Scheme</option>
                  <option value="2022">2022 Scheme</option>
                  <option value="2025">2025 Scheme</option>
                </select>
              </div>

              {/* Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#8A919B]">Resource Type</label>
                <select
                  name="type"
                  defaultValue={type || ''}
                  className="w-full px-3 py-2.5 bg-[#FDFBF9] border border-[#DDE3EA] rounded-xl text-sm outline-none focus:border-[#1E1E1E]"
                >
                  <option value="">All Types</option>
                  {types.map(t => (
                    <option key={t} value={t}>{t.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#1E1E1E] hover:bg-[#333] text-white rounded-xl font-bold text-sm transition-all cursor-pointer"
                >
                  Apply Filters
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Resource Listing */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Promo Callout Card */}
            <div className="bg-gradient-to-r from-[#4f46e5]/10 via-[#a078ff]/5 to-[#f0a050]/5 border border-[#4f46e5]/15 rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="space-y-2 text-center md:text-left">
                <h3 className="text-lg md:text-xl font-bold text-[#1E1E1E] font-['Outfit'] flex items-center justify-center md:justify-start gap-2">
                  <Sparkles size={20} className="text-[#4f46e5]" />
                  <span>Unlock VTU Study Suite</span>
                </h3>
                <p className="text-xs md:text-sm text-[#8A919B] max-w-lg leading-relaxed">
                  Quizzes, AI explanation bots, and personalized VTU mock test generation are unlocked automatically on signup.
                </p>
              </div>
              <Link href="/auth/register" className="shrink-0">
                <button className="px-5 py-3 bg-[#1E1E1E] hover:bg-[#333] text-white rounded-xl font-bold text-sm transition-all flex items-center gap-1.5 cursor-pointer shadow-sm">
                  <span>Sign Up For Free</span>
                  <ArrowRight size={14} />
                </button>
              </Link>
            </div>

            {/* Empty State */}
            {formattedResources.length === 0 && (
              <div className="text-center py-20 bg-white border border-[#dfd3c3]/40 rounded-[2rem] shadow-sm">
                <div className="w-16 h-16 bg-[#F4F6F8] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#DDE3EA]">
                  <AlertCircle size={28} className="text-[#B0B7BF]" />
                </div>
                <h3 className="text-lg font-bold text-[#1E1E1E]">No Public Resources Found</h3>
                <p className="text-sm text-[#8A919B] mt-1 max-w-sm mx-auto leading-relaxed">
                  Try adjusting your filters or search keywords to find VTU study materials.
                </p>
              </div>
            )}

            {/* Grid of resource cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formattedResources.map(resource => (
                <div 
                  key={resource.id}
                  className="bg-white border border-[#dfd3c3]/40 hover:border-[#dfd3c3] rounded-[2rem] p-6 flex flex-col justify-between hover:shadow-md transition-all shadow-sm"
                >
                  <div className="space-y-4">
                    {/* Header Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 bg-[#4f46e5]/10 text-[#4f46e5] text-[10px] font-bold rounded-md uppercase tracking-wider">
                        {resource.type.replace('_', ' ')}
                      </span>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-semibold rounded-md">
                        Sem {resource.semester}
                      </span>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-semibold rounded-md">
                        {resource.branch}
                      </span>
                    </div>

                    {/* Title */}
                    <div>
                      <h4 className="font-extrabold text-base text-[#1E1E1E] leading-snug tracking-tight font-['Outfit'] hover:text-[#4f46e5] transition-colors">
                        {resource.title}
                      </h4>
                      <p className="text-xs text-[#8A919B] font-bold uppercase tracking-wider mt-1">{resource.subject}</p>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-[#8A919B] line-clamp-3 leading-relaxed font-light">
                      {resource.description}
                    </p>
                  </div>

                  {/* Footer metadata and download button */}
                  <div className="border-t border-[#dfd3c3]/30 pt-4 mt-5 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold text-[#1E1E1E] truncate">By {resource.uploadedBy}</p>
                      <p className="text-[9px] text-[#8A919B] font-bold mt-0.5">Scheme {resource.scheme}</p>
                    </div>
                    
                    <PublicResourceDownloader 
                      resourceId={resource.id} 
                      fileName={resource.fileName} 
                      title={resource.title} 
                    />
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </main>

      {/* Footer copyright */}
      <footer className="border-t border-[#dfd3c3]/40 bg-[#F4F6F8] py-8 text-center text-xs text-[#8A919B]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} LearnWave. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/auth/register" className="hover:underline">Sign Up</Link>
            <Link href="/auth/login" className="hover:underline">Login</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
