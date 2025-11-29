import type { Match } from '../types';
import { MapPin, Clock } from 'lucide-react';

export default function MatchCard({ match }: { match: Match }) {
  const date = new Date(match.date);
  const isFinished = match.isFinished;

  return (
    <div className="group relative bg-[#240026] p-1 rounded-3xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(0,255,133,0.15)]">
      {/* Animated Gradient Border */}
      <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isFinished ? 'bg-gradient-to-b from-white/20 to-transparent' : 'bg-gradient-to-b from-pl-cyan to-pl-primary'}`}></div>

      <div className="relative bg-[#2c0030] h-full p-6 rounded-[1.3rem] overflow-hidden flex flex-col border border-white/5">
        
        {/* Header: Status & Date */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-pl-gray uppercase tracking-widest">Matchday</span>
            <span className="text-sm font-black text-white uppercase tracking-wide">
              {date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
            </span>
          </div>
          <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${isFinished ? 'bg-white/5 text-pl-gray border-white/5' : 'bg-pl-cyan/10 text-pl-cyan border-pl-cyan/20 animate-pulse'}`}>
            {isFinished ? 'Full Time' : 'Upcoming'}
          </div>
        </div>

        {/* Teams & Score */}
        <div className="flex items-center justify-between flex-1">
          {/* Home Team */}
          <div className="flex flex-col items-center gap-3 w-1/3">
            <div className="w-14 h-14 p-2 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              {match.homeTeam.logo ? <img src={match.homeTeam.logo} className="w-full h-full object-contain"/> : <div className="w-full h-full bg-gray-200 rounded-full"/>}
            </div>
            <span className="text-xs font-bold text-center text-white leading-tight">{match.homeTeam.name}</span>
          </div>

          {/* Center Info */}
          <div className="flex flex-col items-center justify-center w-1/3 relative z-10">
            {isFinished ? (
              <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-md">
                <span className="text-2xl font-black text-white">{match.homeScore}</span>
                <span className="text-[10px] text-pl-cyan font-bold">:</span>
                <span className="text-2xl font-black text-white">{match.awayScore}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center text-pl-gray gap-1">
                <Clock size={18} className="text-pl-pink mb-1" />
                <span className="text-xs font-black text-white tracking-widest">
                  {date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            )}
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center gap-3 w-1/3">
            <div className="w-14 h-14 p-2 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              {match.awayTeam.logo ? <img src={match.awayTeam.logo} className="w-full h-full object-contain"/> : <div className="w-full h-full bg-gray-200 rounded-full"/>}
            </div>
            <span className="text-xs font-bold text-center text-white leading-tight">{match.awayTeam.name}</span>
          </div>
        </div>

        {/* Footer: Stadium (Style sama dengan halaman Fixtures) */}
        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-center gap-1.5 text-[10px] font-bold text-pl-gray uppercase tracking-wider opacity-70 group-hover:opacity-100 transition-opacity">
           <MapPin size={12} className="text-pl-pink" /> 
           <span>{match.homeTeam.stadium || 'Stadium Unknown'}</span>
        </div>
      </div>
    </div>
  );
}