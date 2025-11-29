import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft, Shield, User, Shirt, Users } from 'lucide-react';
import { apiClient } from '../api/client';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner'; // Import
import type { Team, Player } from '../types';

// ... (Komponen PlayerToken & NoPlayerBadge tetap sama, tidak perlu dicopy ulang) ...
// PASTIKAN PlayerToken dan NoPlayerBadge ADA DI SINI

const PlayerToken = ({ player, onDelete, isSub = false }: { player: Player; onDelete: (id: number) => void, isSub?: boolean }) => {
  const containerSize = isSub ? "w-14 md:w-20" : "w-14 md:w-24";
  const imageSize = isSub ? "w-10 h-10 md:w-14 md:h-14" : "w-10 h-10 md:w-16 md:h-16";
  const fontSize = isSub ? "text-[8px] md:text-[10px]" : "text-[9px] md:text-xs";
  const badgeSize = isSub ? "w-4 h-4 md:w-5 md:h-5 text-[8px] md:text-[10px]" : "w-4 h-4 md:w-6 md:h-6 text-[9px] md:text-[10px]";

  return (
  <div className={`flex flex-col items-center group relative z-10 ${containerSize} flex-shrink-0`}>
    <div className="relative mb-1 transition-transform duration-300 group-hover:scale-110 cursor-pointer">
        {player.photo ? (
            <img src={player.photo} alt={player.name} className={`${imageSize} rounded-full object-cover border md:border-2 border-white shadow-lg bg-pl-primary`} />
        ) : (
            <div className={`${imageSize} rounded-full bg-gradient-to-b from-pl-primary to-black border md:border-2 border-white shadow-lg flex items-center justify-center`}>
                <Shirt className="text-white opacity-80 w-1/2 h-1/2" />
            </div>
        )}
        <div className={`absolute -bottom-1 -right-1 bg-pl-cyan text-pl-primary font-black ${badgeSize} flex items-center justify-center rounded-full border md:border-2 border-pl-primary shadow-sm`}>{player.number}</div>
        <button onClick={(e) => { e.stopPropagation(); onDelete(player.id); }} className="absolute -top-2 -right-2 bg-pl-pink text-white p-0.5 md:p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600 z-20">
            <Trash2 className="w-2.5 h-2.5 md:w-3 md:h-3" />
        </button>
    </div>
    <div className={`bg-pl-primary/90 backdrop-blur-sm text-white ${fontSize} font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded shadow-lg border border-white/10 text-center whitespace-nowrap w-full overflow-hidden text-ellipsis leading-tight relative`}>
      {player.name}
      {isSub && <span className="block text-[7px] md:text-[8px] text-pl-cyan/80 font-black uppercase leading-none mt-0.5">{player.position}</span>}
    </div>
  </div>
)};

export default function TeamDetail() {
  // ... (State dan Logic sama seperti sebelumnya) ...
  const { id } = useParams();
  const [team, setTeam] = useState<Team | null>(null);
  const [newPlayer, setNewPlayer] = useState({ name: '', number: '', position: 'FW' });
  const [loading, setLoading] = useState(true); // Tambah state loading

  // Modal State
  const [modal, setModal] = useState({ isOpen: false, type: 'info' as any, title: '', message: '', onConfirm: () => {} });
  const showModal = (type: any, title: string, message: string, onConfirm?: () => void) => {
    setModal({ isOpen: true, type, title, message, onConfirm: onConfirm || (() => {}) });
  };

  const fetchTeam = async () => {
    if (!id) return;
    try {
      const res = await apiClient.get(`/teams/${id}`);
      setTeam(res.data);
    } catch (error) { console.error(error); }
    finally { setLoading(false); } // Set loading false
  };

  useEffect(() => { fetchTeam(); }, [id]);

  // ... (handleAddPlayer & handleDeletePlayer sama) ...
  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      await apiClient.post('/players', { ...newPlayer, teamId: id, photo: '' });
      setNewPlayer({ name: '', number: '', position: 'FW' });
      fetchTeam();
      showModal('success', 'Success', 'New player added to squad successfully.');
    } catch (error) { 
      showModal('danger', 'Error', 'Failed to add player. Please check the input.'); 
    }
  };

  const handleDeletePlayer = (playerId: number) => {
    showModal('danger', 'Release Player?', 'Are you sure you want to remove this player from the squad? This action cannot be undone.', async () => {
        try {
          await apiClient.delete(`/players/${playerId}`);
          fetchTeam();
          showModal('success', 'Removed', 'Player successfully removed from squad.');
        } catch (error) { showModal('danger', 'Error', 'Failed to remove player.'); }
      }
    );
  };

  const { startingXI, substitutes } = useMemo(() => {
    if (!team?.players) return { startingXI: { gk:[], df:[], mf:[], fw:[] }, substitutes: [] };
    const allPlayers = [...team.players];
    const startersList = allPlayers.slice(0, 11);
    const subsList = allPlayers.slice(11);
    const startingXI = {
        gk: startersList.filter(p => p.position === 'GK'),
        df: startersList.filter(p => p.position === 'DF'),
        mf: startersList.filter(p => p.position === 'MF'),
        fw: startersList.filter(p => p.position === 'FW'),
    };
    return { startingXI, substitutes: subsList };
  }, [team?.players]);

  if (loading) return <LoadingSpinner />; // Render Spinner
  if (!team) return <div className="min-h-screen bg-pl-dark flex justify-center items-center text-white font-bold">Club not found</div>;

  return (
    // ... (JSX sama seperti sebelumnya) ...
    <div className="min-h-screen bg-pl-dark pt-24 md:pt-28 pb-28 md:pb-12 px-3 sm:px-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#2c0030] to-pl-dark overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <Link to="/teams" className="inline-flex items-center gap-2 text-pl-gray hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
            <ArrowLeft size={14} strokeWidth={3} /> Back to Directory
            </Link>
            <div className="md:hidden flex items-center gap-2">
                <span className="text-pl-gray text-xs font-medium uppercase tracking-wider">Manager</span>
                <h2 className="text-lg font-black text-white tracking-tight truncate">{team.coach}</h2>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2 order-2 lg:order-1">
                <div className="hidden md:flex mb-4 items-center gap-2">
                    <span className="text-pl-gray text-sm font-medium uppercase tracking-wider">Manager</span>
                    <h2 className="text-xl font-black text-white tracking-tight">{team.coach}</h2>
                </div>
                
                <div className="flex items-center justify-between mb-3 px-1">
                     <h3 className="text-sm md:text-base font-black text-white uppercase tracking-widest flex items-center gap-2">
                        <Shield size={16} className="text-pl-cyan"/> Starting XI
                     </h3>
                     <span className="text-[10px] font-bold text-pl-gray uppercase">{startingXI.gk.length + startingXI.df.length + startingXI.mf.length + startingXI.fw.length} Players On Pitch</span>
                </div>

                <div className="relative w-full aspect-square md:aspect-[16/11] bg-[#38003c] rounded-[1.5rem] md:rounded-[2rem] border-2 md:border-4 border-[#4a0050] shadow-2xl overflow-hidden select-none group">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:2rem_2rem] md:bg-[size:4rem_4rem]"></div>
                    <div className="absolute top-1/2 left-0 w-full h-px md:h-0.5 bg-white/10 -translate-y-1/2"></div>
                    <div className="absolute top-1/2 left-1/2 w-24 h-24 md:w-48 md:h-48 border md:border-2 border-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute top-0 left-1/2 w-3/5 md:w-1/2 h-1/6 border-x border-b md:border-x-2 md:border-b-2 border-white/10 -translate-x-1/2 rounded-b-xl"></div>
                    <div className="absolute bottom-0 left-1/2 w-3/5 md:w-1/2 h-1/6 border-x border-t md:border-x-2 md:border-t-2 border-white/10 -translate-x-1/2 rounded-t-xl"></div>
                    
                    <div className="absolute inset-0 flex flex-col justify-between py-6 px-2 md:py-12 md:px-4">
                        <div className="flex justify-center">
                            {startingXI.gk.length > 0 ? startingXI.gk.map(p => <PlayerToken key={p.id} player={p} onDelete={handleDeletePlayer} />) : <NoPlayerBadge pos="GK" />}
                        </div>
                        <div className="flex justify-center gap-1 md:gap-8 px-1">
                            {startingXI.df.length > 0 ? startingXI.df.map(p => <PlayerToken key={p.id} player={p} onDelete={handleDeletePlayer} />) : <NoPlayerBadge pos="DF" />}
                        </div>
                        <div className="flex justify-center gap-1 md:gap-8 px-1">
                            {startingXI.mf.length > 0 ? startingXI.mf.map(p => <PlayerToken key={p.id} player={p} onDelete={handleDeletePlayer} />) : <NoPlayerBadge pos="MF" />}
                        </div>
                        <div className="flex justify-center gap-1 md:gap-8 px-1">
                            {startingXI.fw.length > 0 ? startingXI.fw.map(p => <PlayerToken key={p.id} player={p} onDelete={handleDeletePlayer} />) : <NoPlayerBadge pos="FW" />}
                        </div>
                    </div>
                </div>
                
                {substitutes.length > 0 && (
                    <div className="mt-6 md:mt-8 animate-[fadeIn_0.5s_ease-out]">
                        <h3 className="text-sm md:text-base font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2 pl-1">
                           <Users size={16} className="text-pl-pink"/> Substitutes Bench
                           <span className="text-[10px] font-bold text-pl-gray ml-auto bg-white/5 px-2 py-0.5 rounded-full">{substitutes.length} Available</span>
                        </h3>
                        <div className="bg-[#240026]/60 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/5 backdrop-blur-xl shadow-inner">
                            <div className="flex flex-wrap justify-center gap-x-2 gap-y-4 md:gap-x-4 md:gap-y-6">
                                {substitutes.map(p => (
                                    <PlayerToken key={p.id} player={p} onDelete={handleDeletePlayer} isSub={true} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="lg:col-span-1 space-y-6 order-1 lg:order-2">
                <div className="bg-[#240026] p-5 md:p-6 rounded-3xl border border-white/5 flex items-center gap-4 md:gap-5 shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-pl-cyan/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-pl-cyan/10 transition-colors"></div>
                    <div className="w-16 h-16 md:w-20 md:h-20 p-2 md:p-3 bg-white rounded-2xl flex items-center justify-center shadow-lg relative z-10 group-hover:scale-105 transition-transform">
                        {team.logo ? <img src={team.logo} className="w-full h-full object-contain"/> : <Shield className="text-gray-300"/>}
                    </div>
                    <div className="relative z-10 overflow-hidden">
                        <h1 className="text-xl md:text-2xl font-black text-white leading-none mb-1 truncate">{team.name}</h1>
                        <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-pl-gray uppercase tracking-wider truncate">
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-pl-cyan rounded-full animate-pulse shrink-0"></div>
                            <span className="truncate">{team.stadium || 'Stadium N/A'}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-pl-primary/50 p-5 md:p-6 rounded-3xl border border-white/10 backdrop-blur-xl sticky md:top-24">
                    <div className="flex items-center gap-2 mb-4 md:mb-5 text-pl-cyan border-b border-white/10 pb-3">
                        <User className="w-4 h-4 md:w-[18px] md:h-[18px]" strokeWidth={3} />
                        <h3 className="text-xs md:text-sm font-black uppercase tracking-widest">Squad Management</h3>
                    </div>
                    <form onSubmit={handleAddPlayer} className="flex flex-col gap-3 md:gap-4">
                        <div>
                            <label className="text-[9px] md:text-[10px] font-bold uppercase text-pl-gray mb-1 block ml-1">Jersey No.</label>
                            <input required type="number" className="w-full p-2.5 md:p-3 bg-black/30 border border-white/10 text-white rounded-xl focus:border-pl-cyan focus:ring-1 focus:ring-pl-cyan outline-none font-mono font-bold text-sm md:text-base placeholder-white/10 transition-all" placeholder="00" value={newPlayer.number} onChange={e => setNewPlayer({...newPlayer, number: e.target.value})} />
                        </div>
                        <div>
                            <label className="text-[9px] md:text-[10px] font-bold uppercase text-pl-gray mb-1 block ml-1">Player Name</label>
                            <input required className="w-full p-2.5 md:p-3 bg-black/30 border border-white/10 text-white rounded-xl focus:border-pl-cyan focus:ring-1 focus:ring-pl-cyan outline-none font-bold text-sm md:text-base placeholder-white/10 transition-all" placeholder="e.g. Bukayo Saka" value={newPlayer.name} onChange={e => setNewPlayer({...newPlayer, name: e.target.value})} />
                        </div>
                        <div>
                            <label className="text-[9px] md:text-[10px] font-bold uppercase text-pl-gray mb-1 block ml-1">Position</label>
                            <div className="grid grid-cols-4 gap-1.5 md:gap-2">
                                {['GK', 'DF', 'MF', 'FW'].map((pos) => (
                                    <button key={pos} type="button" onClick={() => setNewPlayer({...newPlayer, position: pos})} className={`py-2 md:py-2.5 rounded-lg text-[9px] md:text-[10px] font-black transition-all border uppercase tracking-wider ${newPlayer.position === pos ? 'bg-pl-cyan text-pl-primary border-pl-cyan shadow-lg' : 'bg-black/30 text-pl-gray border-white/5 hover:bg-white/5 hover:text-white'}`}>{pos}</button>
                                ))}
                            </div>
                        </div>
                        <button type="submit" className="mt-2 bg-gradient-to-r from-pl-pink to-red-600 text-white py-3 md:py-3.5 rounded-xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-pl-pink/20 flex items-center justify-center gap-2 text-xs md:text-sm">
                            <Plus className="w-4 h-4 md:w-[18px] md:h-[18px]" strokeWidth={3} /> Add Player
                        </button>
                    </form>
                </div>
            </div>
        </div>

        <Modal isOpen={modal.isOpen} onClose={() => setModal(prev => ({ ...prev, isOpen: false }))} onConfirm={modal.onConfirm} title={modal.title} message={modal.message} type={modal.type} confirmText={modal.type === 'danger' ? 'Remove' : 'OK'} />
      </div>
    </div>
  );
}

const NoPlayerBadge = ({ pos }: { pos: string }) => (
    <div className="text-white/20 text-[9px] md:text-xs font-bold uppercase border border-white/10 px-2 py-1 md:px-3 rounded-full backdrop-blur-sm">No {pos}</div>
);