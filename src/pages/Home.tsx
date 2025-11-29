import { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import StandingsTable from '../components/StandingsTable';
import MatchCard from '../components/MatchCard';
import LoadingSpinner from '../components/LoadingSpinner'; // Import Spinner
import { ChevronRight, ArrowRight, Activity, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Standing, Match } from '../types';

export default function Home() {
  const [standings, setStandings] = useState<Standing[]>([]);
  const [recentMatches, setRecentMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resStandings, resMatches] = await Promise.all([
          apiClient.get('/standings'),
          apiClient.get('/matches')
        ]);
        
        const standingsData = resStandings.data;
        const matchesData = resMatches.data;

        setStandings(standingsData);

        const enrichedMatches = matchesData.map((match: any) => {
            const homeTeamInfo = standingsData.find((s: any) => s.team.id === match.homeTeamId)?.team;
            return {
                ...match,
                homeTeam: {
                    ...match.homeTeam,
                    stadium: homeTeamInfo?.stadium || 'Stadium Unknown'
                }
            };
        });

        const sortedMatches = enrichedMatches.sort((a: Match, b: Match) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setRecentMatches(sortedMatches.slice(0, 4));
      } catch (error) {
        console.error("Error", error);
      } finally {
        // Sedikit delay buatan (500ms) agar spinner sempat terlihat smooth (opsional)
        setTimeout(() => setLoading(false), 500);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />; // Ganti loading lama dengan Component Baru

  return (
    <main className="min-h-screen pt-20 md:pt-24 pb-28 md:pb-12 px-4 sm:px-6 bg-pl-dark bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pl-primary via-pl-dark to-pl-dark">
      {/* ... (SISA KODE SAMA SEPERTI SEBELUMNYA) ... */}
      {/* Hero Banner */}
      <div className="max-w-7xl mx-auto mb-12 relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-pl-cyan via-pl-pink to-pl-primary rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
        <div className="relative bg-[#2c0030] rounded-[2.5rem] p-8 md:p-16 overflow-hidden border border-white/10 shadow-2xl">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[url('https://resources.premierleague.com/premierleague/photo/2022/08/03/a9e5d394-4079-4343-867d-366e75d638f2/PL-Lion-Graphic-2.png')] bg-contain bg-no-repeat bg-right-top opacity-10 mix-blend-screen pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-pl-cyan/20 rounded-full blur-3xl"></div>

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-pl-cyan text-xs font-black tracking-[0.2em] uppercase mb-6 hover:bg-white/10 transition-colors cursor-default">
              <span className="w-2 h-2 rounded-full bg-pl-pink animate-pulse"></span> Live Season 2025/26
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-[0.95]">
              THE WORLD'S <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pl-cyan to-white">BEST LEAGUE</span>
            </h1>
            <p className="text-pl-gray text-base md:text-lg max-w-xl mb-10 leading-relaxed font-medium">
              Experience the thrill of the Premier League. Access comprehensive match data, live standings, and club insights in one premium dashboard.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/matches" className="group/btn relative px-8 py-4 bg-pl-cyan text-pl-primary rounded-xl font-black overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(0,255,133,0.4)] text-sm md:text-base">
                <span className="relative z-10 flex items-center gap-2">
                  View Fixtures <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform"/>
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
              </Link>
              <Link to="/teams" className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-xl font-bold hover:bg-white/10 hover:border-white/30 transition-all text-sm md:text-base">
                Club Directory
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              <span className="w-2 h-8 bg-gradient-to-b from-pl-cyan to-pl-primary rounded-full block"></span>
              League Table
            </h3>
          </div>
          <StandingsTable data={standings} />
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-end px-2 border-b border-white/5 pb-4">
             <div>
               <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                 <Activity className="text-pl-pink" /> Match Centre
               </h3>
               <p className="text-pl-gray text-xs font-medium mt-1">Latest results & upcoming fixtures</p>
             </div>
             <Link to="/matches" className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-pl-cyan hover:text-pl-primary text-white transition-all">
               <ChevronRight size={16}/>
             </Link>
          </div>
          
          <div className="grid gap-4">
            {recentMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
            {recentMatches.length === 0 && (
              <div className="p-10 text-center border-2 border-dashed border-white/10 rounded-2xl text-pl-gray bg-white/5">
                No matches scheduled recently.
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-pl-pink to-purple-600 rounded-2xl p-6 text-white shadow-lg mt-8 relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform">
            <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
              <Trophy size={80} />
            </div>
            <h4 className="text-lg font-black mb-2 relative z-10">Manage Your Club</h4>
            <p className="text-white/80 text-xs font-medium mb-4 max-w-[80%] relative z-10">Update squad lists, jersey numbers, and team details.</p>
            <Link to="/teams" className="inline-block bg-white text-pl-pink px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider hover:bg-pl-dark hover:text-white transition-colors relative z-10">
              Go to Clubs
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}