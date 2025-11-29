import { Trophy } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-pl-dark flex flex-col justify-center items-center gap-6 relative overflow-hidden">
      
      {/* Background Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pl-cyan/20 rounded-full blur-[100px] animate-pulse"></div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Spinner Circle */}
        <div className="relative w-20 h-20">
            {/* Outer Ring */}
            <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
            {/* Spinning Ring */}
            <div className="absolute inset-0 border-4 border-pl-cyan border-t-transparent rounded-full animate-spin"></div>
            
            {/* Icon Tengah (Optional) */}
            <div className="absolute inset-0 flex items-center justify-center">
                <Trophy size={24} className="text-white/50 animate-pulse" />
            </div>
        </div>

        <h2 className="mt-6 text-xl font-black text-white tracking-[0.2em] animate-pulse">
            LOADING
            <span className="text-pl-cyan">...</span>
        </h2>
      </div>
    </div>
  );
}