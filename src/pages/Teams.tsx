import { useEffect, useState } from 'react';
import { Plus, MapPin, ArrowUpRight, X, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';
import type { Team } from '../types';

export default function Teams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    coach: '',
    stadium: '',
    founded: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{isOpen: boolean, id: number | null, name: string}>({
    isOpen: false,
    id: null,
    name: ''
  });

  useEffect(() => {
    apiClient.get('/teams')
      .then(res => setTeams(res.data))
      .finally(() => setTimeout(() => setLoading(false), 500));
  }, []);

  // Auto dismiss notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        founded: formData.founded ? parseInt(formData.founded) : null
      };
      const res = await apiClient.post('/teams', payload);
      setTeams(prev => [...prev, res.data]);
      setIsModalOpen(false);
      setFormData({ name: '', logo: '', coach: '', stadium: '', founded: '' });
      setNotification({ type: 'success', message: 'Club added successfully!' });
    } catch (error) {
      console.error("Failed to create team", error);
      setNotification({ type: 'error', message: 'Failed to create club. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, team: Team) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteConfirm({ isOpen: true, id: team.id, name: team.name });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.id) return;
    
    try {
      await apiClient.delete(`/teams/${deleteConfirm.id}`);
      setTeams(prev => prev.filter(t => t.id !== deleteConfirm.id));
      setNotification({ type: 'success', message: 'Club deleted successfully!' });
      setDeleteConfirm({ isOpen: false, id: null, name: '' });
    } catch (error) {
      console.error("Failed to delete team", error);
      setNotification({ type: 'error', message: 'Failed to delete club. Please try again.' });
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-pl-dark pt-24 md:pt-32 pb-28 md:pb-24 px-4 md:px-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#2c0030] to-pl-dark">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-10 pb-6 md:pb-8 border-b border-white/5 gap-4">
           <div>
             <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-2">
               Clubs
             </h1>
             <p className="text-pl-gray font-medium text-sm md:text-base max-w-md">
               Directory of all {teams.length} competing clubs in the 2025/26 season.
             </p>
           </div>
           <button 
             onClick={() => setIsModalOpen(true)}
             className="group bg-white text-pl-primary px-5 py-2.5 rounded-xl text-xs md:text-sm font-black uppercase tracking-wider flex items-center gap-2 hover:bg-pl-cyan transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
           >
             <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300"/> Add New Club
           </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {teams.map((team) => (
            <Link to={`/teams/${team.id}`} key={team.id} className="group relative bg-[#240026] p-1 rounded-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <div className="absolute inset-0 bg-gradient-to-b from-pl-cyan to-pl-pink rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative bg-[#2c0030] h-full p-4 md:p-5 rounded-[calc(1rem-1px)] overflow-hidden flex flex-col items-center border border-white/5">
                
                {/* Delete Button */}
                <button 
                  onClick={(e) => handleDeleteClick(e, team)}
                  className="absolute top-2 right-2 z-20 p-1.5 rounded-full bg-black/40 text-white/50 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                  title="Delete Club"
                >
                  <Trash2 size={14} />
                </button>

                {team.logo && (
                  <img src={team.logo} className="absolute -right-6 -bottom-6 w-32 h-32 object-contain opacity-5 grayscale group-hover:grayscale-0 group-hover:opacity-10 transition-all duration-500 rotate-12"/>
                )}

                <div className="w-20 h-20 md:w-24 md:h-24 p-3 bg-white rounded-full flex items-center justify-center shadow-xl mb-4 group-hover:scale-110 transition-transform duration-500 relative z-10">
                   {team.logo ? <img src={team.logo} className="w-full h-full object-contain drop-shadow-md"/> : <div className="w-full h-full bg-gray-100 rounded-full"/>}
                </div>
                
                <h2 className="text-lg md:text-xl font-black text-white text-center mb-1 tracking-tight relative z-10 leading-tight">{team.name}</h2>
                
                <div className="flex items-center gap-1 text-pl-gray text-[9px] md:text-[10px] font-bold uppercase tracking-wider mb-6 bg-black/20 px-2.5 py-1 rounded-full border border-white/5 relative z-10 max-w-full">
                  <MapPin size={10} className="text-pl-pink flex-shrink-0"/> 
                  <span className="truncate">{team.stadium || 'N/A'}</span>
                </div>
                
                <div className="w-full flex items-center justify-between mt-auto pt-4 border-t border-white/5 relative z-10">
                   <div className="text-left overflow-hidden">
                     <span className="block text-[9px] text-pl-gray/60 font-bold uppercase tracking-wider mb-0.5">Manager</span>
                     <span className="font-bold text-white text-xs md:text-sm truncate block">{team.coach}</span>
                   </div>
                   <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white group-hover:bg-pl-cyan group-hover:text-pl-primary transition-colors duration-300 flex-shrink-0">
                     <ArrowUpRight size={16} />
                   </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="fixed bottom-24 md:bottom-10 right-4 md:right-10 z-[60] animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border ${
              notification.type === 'success' 
                ? 'bg-[#2c0030] border-pl-cyan text-white' 
                : 'bg-red-900/90 border-red-500 text-white'
            }`}>
              {notification.type === 'success' ? (
                <CheckCircle className="text-pl-cyan" size={24} />
              ) : (
                <AlertCircle className="text-red-400" size={24} />
              )}
              <div>
                <h4 className="font-black uppercase tracking-wider text-sm">
                  {notification.type === 'success' ? 'Success' : 'Error'}
                </h4>
                <p className="text-xs font-medium opacity-90">{notification.message}</p>
              </div>
              <button onClick={() => setNotification(null)} className="ml-4 opacity-50 hover:opacity-100">
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Add Team Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#2c0030] w-full max-w-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-pl-gray hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="p-6 md:p-8">
                <h2 className="text-2xl font-black text-white mb-6 tracking-tight">Add New Club</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-pl-gray uppercase tracking-wider mb-2">Club Name</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pl-cyan focus:ring-1 focus:ring-pl-cyan transition-all"
                      placeholder="e.g. Arsenal"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-pl-gray uppercase tracking-wider mb-2">Logo URL</label>
                    <input 
                      type="url" 
                      name="logo"
                      value={formData.logo}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pl-cyan focus:ring-1 focus:ring-pl-cyan transition-all"
                      placeholder="https://..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-pl-gray uppercase tracking-wider mb-2">Manager</label>
                      <input 
                        type="text" 
                        name="coach"
                        required
                        value={formData.coach}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pl-cyan focus:ring-1 focus:ring-pl-cyan transition-all"
                        placeholder="e.g. Mikel Arteta"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-pl-gray uppercase tracking-wider mb-2">Founded Year</label>
                      <input 
                        type="number" 
                        name="founded"
                        value={formData.founded}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pl-cyan focus:ring-1 focus:ring-pl-cyan transition-all"
                        placeholder="e.g. 1886"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-pl-gray uppercase tracking-wider mb-2">Stadium</label>
                    <input 
                      type="text" 
                      name="stadium"
                      value={formData.stadium}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pl-cyan focus:ring-1 focus:ring-pl-cyan transition-all"
                      placeholder="e.g. Emirates Stadium"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full bg-pl-cyan text-pl-primary font-black uppercase tracking-wider py-4 rounded-xl hover:bg-white transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Creating...' : 'Create Club'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm.isOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#2c0030] w-full max-w-sm rounded-2xl border border-white/10 shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200">
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="text-red-500" size={32} />
                </div>
                <h3 className="text-xl font-black text-white mb-2">Delete Club?</h3>
                <p className="text-pl-gray text-sm mb-6">
                  Are you sure you want to delete <span className="text-white font-bold">{deleteConfirm.name}</span>? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setDeleteConfirm({ isOpen: false, id: null, name: '' })}
                    className="flex-1 py-3 rounded-xl font-bold text-white bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={confirmDelete}
                    className="flex-1 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}