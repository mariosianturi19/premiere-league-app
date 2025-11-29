import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message?: string; // Jadi optional karena bisa diganti children
  children?: React.ReactNode; // Tambahan untuk custom content (Form)
  type?: 'danger' | 'success' | 'info' | 'form'; // Tambah tipe 'form'
  confirmText?: string;
  cancelText?: string;
}

export default function Modal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  children,
  type = 'info', 
  confirmText = 'Confirm', 
  cancelText = 'Cancel' 
}: ModalProps) {
  
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const config = {
    danger: {
      icon: <AlertTriangle size={24} className="text-pl-pink" />,
      button: 'bg-pl-pink text-white hover:bg-red-600 shadow-[0_0_15px_rgba(233,0,82,0.4)]',
      border: 'border-pl-pink/30',
      gradient: 'via-pl-pink'
    },
    success: {
      icon: <CheckCircle size={24} className="text-pl-cyan" />,
      button: 'bg-pl-cyan text-pl-primary hover:bg-white shadow-[0_0_15px_rgba(0,255,133,0.4)]',
      border: 'border-pl-cyan/30',
      gradient: 'via-pl-cyan'
    },
    info: {
      icon: <Info size={24} className="text-blue-400" />,
      button: 'bg-blue-500 text-white hover:bg-blue-600',
      border: 'border-blue-500/30',
      gradient: 'via-blue-500'
    },
    form: { // Style khusus untuk Form Modal
      icon: <Info size={24} className="text-pl-cyan" />,
      button: 'bg-pl-cyan text-pl-primary',
      border: 'border-white/10',
      gradient: 'via-pl-cyan'
    }
  };

  const currentConfig = config[type];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div 
        className="absolute inset-0 bg-pl-dark/90 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      ></div>

      <div className={`relative bg-[#240026] w-full ${type === 'form' ? 'max-w-lg' : 'max-w-md'} rounded-3xl border ${currentConfig.border} shadow-2xl p-6 md:p-8 transform transition-all duration-300 scale-100 animate-[fadeIn_0.2s_ease-out] max-h-[90vh] overflow-y-auto`}>
        
        <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent ${currentConfig.gradient} to-transparent`}></div>

        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-pl-gray hover:text-white transition-colors bg-white/5 p-1.5 rounded-full hover:bg-white/10 z-10"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col">
          {type !== 'form' && (
            <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-pl-primary rounded-2xl flex items-center justify-center shadow-lg border border-white/5">
                    {currentConfig.icon}
                </div>
            </div>
          )}

          <h3 className={`text-2xl font-black text-white uppercase tracking-tight mb-4 ${type !== 'form' ? 'text-center' : 'text-left pr-8'}`}>
            {title}
          </h3>
          
          {/* Render Children (Form) jika ada, jika tidak render Message */}
          {children ? (
            <div className="text-left w-full">
                {children}
            </div>
          ) : (
            <p className="text-pl-gray text-sm font-medium leading-relaxed mb-8 text-center">
                {message}
            </p>
          )}

          {/* Tombol Default (Hanya muncul jika bukan Form custom) */}
          {!children && (
            <div className="flex gap-3 w-full">
                {onConfirm && (
                <button 
                    onClick={onClose}
                    className="flex-1 py-3 rounded-xl text-sm font-bold text-pl-gray bg-white/5 hover:bg-white/10 hover:text-white transition-all border border-white/5"
                >
                    {cancelText}
                </button>
                )}
                
                <button 
                onClick={() => {
                    if (onConfirm) onConfirm();
                    else onClose();
                }}
                className={`flex-1 py-3 rounded-xl text-sm font-black uppercase tracking-wider transition-all transform hover:scale-[1.02] active:scale-95 ${currentConfig.button}`}
                >
                {confirmText}
                </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}