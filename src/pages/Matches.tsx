import { useEffect, useState, useRef } from 'react';
import { Calendar, CheckCircle, Plus, Clock, ChevronDown, MapPin } from 'lucide-react';
import { apiClient } from '../api/client';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import type { Match, Team } from '../types';

// --- 1. DEFINISI INTERFACE (WAJIB ADA DI ATAS) ---
interface CustomSelectProps {
  label: string;
  options: Team[];
  value: string | number;
  onChange: (val: string) => void;
  placeholder?: string;
}

// --- 2. KOMPONEN CUSTOM SELECT ---
const CustomSelect = ({ label, options, value, onChange, placeholder = "Select Club" }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedTeam = options.find((t) => t.id.toString() === value.toString());

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <label className="text-[10px] font-bold uppercase text-pl-gray mb-2 block tracking-wider">{label}</label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-3.5 bg-black/40 border ${isOpen ? 'border-pl-cyan ring-1 ring-pl-cyan' : 'border-white/10'} rounded-xl flex items-center justify-between cursor-pointer transition-all hover:bg-black/60`}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          {selectedTeam ? (
            <>
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center p-0.5 flex-shrink-0">
                {selectedTeam.logo && <img src={selectedTeam.logo} className="w-full h-full object-contain" alt={selectedTeam.name}/>}
              </div>
              <span className="text-white font-bold text-sm truncate">{selectedTeam.name}</span>
            </>
          ) : (
            <span className="text-gray-500 text-sm font-medium">{placeholder}</span>
          )}
        </div>
        <ChevronDown size={16} className={`text-pl-gray transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-[#1f0022] border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-100">
          {options.map((team) => (
            <div 
              key={team.id}
              onClick={() => {
                onChange(team.id.toString());
                setIsOpen(false);
              }}
              className={`flex items-center gap-3 p-3 cursor-pointer transition-colors border-b border-white/5 last:border-0
                ${value.toString() === team.id.toString() ? 'bg-pl-cyan/10' : 'hover:bg-white/5'}
              `}
            >
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center p-1 flex-shrink-0">
                 {team.logo && <img src={team.logo} className="w-full h-full object-contain" alt={team.name}/>}
              </div>
              <span className={`text-sm font-bold ${value.toString() === team.id.toString() ? 'text-pl-cyan' : 'text-white'}`}>
                {team.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- 3. HALAMAN MATCHES ---

export default function Matches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [schedule, setSchedule] = useState({ homeTeamId: '', awayTeamId: '', date: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [score, setScore] = useState({ homeScore: 0, awayScore: 0 });

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [alertModal, setAlertModal] = useState({ isOpen: false, type: 'success' as any, title: '', message: '' });

  const fetchData = async () => {
    try {
      const [resMatches, resTeams] = await Promise.all([
        apiClient.get('/matches'),
        apiClient.get('/teams')
      ]);
      setMatches(resMatches.data);
      setTeams(resTeams.data);
    } catch (error) { 
        console.error(error); 
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi: Tim tidak boleh sama
    if (schedule.homeTeamId === schedule.awayTeamId) {
        setAlertModal({ 
            isOpen: true, 
            type: 'danger', 
            title: 'Invalid Selection', 
            message: 'Home Team and Away Team cannot be the same club.' 
        });
        return;
    }

    try {
        // Convert local time to UTC ISO string before sending
        const payload = {
            ...schedule,
            date: new Date(schedule.date).toISOString()
        };
        await apiClient.post('/matches', payload);
        setSchedule({ homeTeamId: '', awayTeamId: '', date: '' });
        fetchData();
        setIsScheduleModalOpen(false); 
        setAlertModal({ isOpen: true, type: 'success', title: 'Success', message: 'Match scheduled successfully.' });
    } catch (error) {
        setAlertModal({ isOpen: true, type: 'danger', title: 'Error', message: 'Failed to schedule match.' });
    }
  };

  const handleUpdateScore = async (matchId: number) => {
    try {
        await apiClient.patch(`/matches/${matchId}`, { ...score, isFinished: true });
        setEditingId(null);
        fetchData();
    } catch (error) {
        setAlertModal({ isOpen: true, type: 'danger', title: 'Error', message: 'Failed to update score.' });
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-pl-dark pt-24 md:pt-32 pb-28 md:pb-24 px-6 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-[#2c0030] to-pl-dark">
      <div className="max-w-5xl mx-auto">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 pb-8 border-b border-white/5 gap-6">
            <div>
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-3">
                  Fixtures
                </h1>
                <p className="text-pl-gray font-medium text-base md:text-lg max-w-md">
                  Directory of all matches & live results for 2025/26 season.
                </p>
            </div>
            
            <button 
                onClick={() => setIsScheduleModalOpen(true)}
                className="group bg-pl-cyan text-pl-primary px-6 py-3 rounded-xl text-sm font-black uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(0,255,133,0.2)] hover:bg-white transition-all hover:scale-105 active:scale-95 w-full md:w-auto justify-center"
            >
                <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" strokeWidth={3}/> 
                Create Match
            </button>
        </div>

        {/* Matches List */}
        <div className="space-y-3 md:space-y-4">
           {matches.map((match) => {
             const homeClubInfo = teams.find(t => t.id === match.homeTeamId);
             const stadiumName = homeClubInfo?.stadium || 'Stadium Unknown';

             return (
             <div key={match.id} className="bg-[#240026] p-4 md:p-6 rounded-2xl border border-white/5 relative overflow-hidden hover:border-pl-cyan/30 transition-all group">
                
                {/* Date Header */}
                <div className="flex justify-between items-center mb-4 md:mb-0 md:absolute md:top-6 md:left-6 md:flex-col md:items-start">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-pl-gray uppercase tracking-wider">
                            {new Date(match.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                        </span>
                        {!match.isFinished && (
                            <span className="md:hidden text-[10px] font-bold text-white bg-white/10 px-1.5 py-0.5 rounded">
                                {new Date(match.date).toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'})}
                            </span>
                        )}
                    </div>
                    <div className={`text-[9px] md:text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-widest border ${match.isFinished ? 'bg-white/5 text-pl-gray border-white/5' : 'bg-pl-cyan/10 text-pl-cyan border-pl-cyan/20'}`}>
                        {match.isFinished ? 'FT' : 'Live'}
                    </div>
                </div>

                {/* Teams Grid */}
                <div className="grid grid-cols-3 items-center gap-2 md:ml-40 md:mr-40">
                   {/* Home Team */}
                   <div className="flex flex-col md:flex-row items-center md:justify-end gap-2 text-center md:text-right">
                        <div className="md:order-2 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center p-1 shadow-lg">
                            {match.homeTeam.logo ? <img src={match.homeTeam.logo} className="w-full h-full object-contain" alt={match.homeTeam.name}/> : <div className="w-full h-full bg-gray-200 rounded-full"/>}
                        </div>
                        <span className="text-xs md:text-lg font-bold text-white md:order-1 leading-tight line-clamp-2">
                            {match.homeTeam.name}
                        </span>
                   </div>
                   
                   {/* Score / Center */}
                   <div className="flex justify-center">
                      {match.isFinished && editingId !== match.id ? (
                        <div className="bg-black/40 px-3 py-1.5 md:px-6 md:py-2 rounded-lg border border-white/10 backdrop-blur-sm">
                            <span className="text-xl md:text-3xl font-black text-white tracking-widest whitespace-nowrap">
                                {match.homeScore} <span className="text-pl-cyan text-sm">-</span> {match.awayScore}
                            </span>
                        </div>
                      ) : (
                        !match.isFinished && editingId !== match.id ? (
                           <div className="hidden md:flex flex-col items-center text-pl-gray">
                              <Clock size={20} className="mb-1 text-pl-pink" />
                              <span className="text-xs font-bold">{new Date(match.date).toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'})}</span>
                           </div>
                        ) : (
                           // Edit Mode
                           <div className="flex gap-2 items-center justify-center">
                              <input type="number" className="w-8 md:w-10 text-center font-bold text-lg bg-transparent text-white border-b border-pl-cyan outline-none" placeholder="0" 
                                onChange={e => { setEditingId(match.id); setScore(prev => ({...prev, homeScore: parseInt(e.target.value)})) }} 
                              />
                              <span className="text-pl-gray">:</span>
                              <input type="number" className="w-8 md:w-10 text-center font-bold text-lg bg-transparent text-white border-b border-pl-cyan outline-none" placeholder="0" 
                                onChange={e => { setEditingId(match.id); setScore(prev => ({...prev, awayScore: parseInt(e.target.value)})) }}
                              />
                           </div>
                        )
                      )}
                   </div>

                   {/* Away Team */}
                   <div className="flex flex-col md:flex-row items-center md:justify-start gap-2 text-center md:text-left">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center p-1 shadow-lg">
                            {match.awayTeam.logo ? <img src={match.awayTeam.logo} className="w-full h-full object-contain" alt={match.awayTeam.name}/> : <div className="w-full h-full bg-gray-200 rounded-full"/>}
                        </div>
                        <span className="text-xs md:text-lg font-bold text-white leading-tight line-clamp-2">
                            {match.awayTeam.name}
                        </span>
                   </div>
                </div>

                {/* Stadium Info */}
                <div className="flex items-center justify-center gap-1.5 mt-3 md:mt-2 text-[10px] font-bold text-pl-gray uppercase tracking-wider opacity-70 group-hover:opacity-100 transition-opacity">
                    <MapPin size={12} className="text-pl-pink"/> 
                    <span>{stadiumName}</span>
                </div>

                {/* Action Button */}
                <div className="mt-4 md:mt-0 md:absolute md:top-1/2 md:right-6 md:-translate-y-1/2 w-full md:w-auto">
                   {editingId === match.id ? (
                      <button onClick={() => handleUpdateScore(match.id)} className="bg-pl-cyan text-pl-primary w-full md:w-auto px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg">
                        <CheckCircle size={14}/> Save
                      </button>
                   ) : (
                      !match.isFinished && (
                        <button onClick={() => setEditingId(match.id)} className="w-full md:w-auto text-pl-gray hover:text-white text-[10px] md:text-xs font-bold border border-white/10 hover:border-white/30 px-4 py-2 rounded-lg transition-all bg-white/5">
                            Update Score
                        </button>
                      )
                   )}
                </div>

             </div>
           )})}
        </div>

        {/* --- MODAL FORM SCHEDULE --- */}
        <Modal
            isOpen={isScheduleModalOpen}
            onClose={() => setIsScheduleModalOpen(false)}
            title="New Fixture"
            type="form"
        >
            <form onSubmit={handleSchedule} className="flex flex-col gap-5 mt-2">
                {/* Custom Team Selectors */}
                <div className="grid grid-cols-1 gap-4">
                    <CustomSelect 
                        label="Home Team"
                        options={teams}
                        value={schedule.homeTeamId}
                        onChange={(val) => setSchedule(prev => ({...prev, homeTeamId: val}))}
                        placeholder="Select Home Club"
                    />
                    
                    <div className="flex items-center justify-center text-pl-gray text-xs font-black uppercase tracking-[0.2em] py-1">
                       - VS -
                    </div>

                    <CustomSelect 
                        label="Away Team"
                        options={teams}
                        value={schedule.awayTeamId}
                        onChange={(val) => setSchedule(prev => ({...prev, awayTeamId: val}))}
                        placeholder="Select Away Club"
                    />
                </div>

                {/* Custom Styled Date Picker */}
                <div>
                    <label className="text-[10px] font-bold uppercase text-pl-gray mb-2 block tracking-wider">Date & Kick Off</label>
                    <div className="relative">
                        <input 
                            type="datetime-local" 
                            className="w-full p-3.5 bg-black/40 border border-white/10 text-white rounded-xl font-bold text-sm focus:border-pl-cyan outline-none cursor-pointer [color-scheme:dark]" 
                            required 
                            value={schedule.date} 
                            onChange={e=>setSchedule(prev => ({...prev, date: e.target.value}))} 
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-pl-gray">
                            <Calendar size={18} />
                        </div>
                    </div>
                </div>

                <button type="submit" className="mt-4 bg-gradient-to-r from-pl-cyan to-green-400 text-pl-primary py-4 rounded-xl font-black uppercase tracking-widest hover:shadow-[0_0_20px_rgba(0,255,133,0.4)] transition-all hover:scale-[1.02]">
                    Confirm Schedule
                </button>
            </form>
        </Modal>

        <Modal 
          isOpen={alertModal.isOpen}
          onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
          title={alertModal.title}
          message={alertModal.message}
          type={alertModal.type}
        />
      </div>
    </div>
  );
}