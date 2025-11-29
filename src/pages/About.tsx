import { Github, Instagram, Linkedin, Mail, Code2, Database, Layout, Server, Cpu } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-pl-dark pt-24 md:pt-32 pb-12 px-4 sm:px-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#2c0030] via-pl-dark to-pl-dark">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16 relative">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-pl-cyan/10 rounded-full blur-3xl pointer-events-none"></div>
           <h1 className="relative z-10 text-5xl md:text-7xl font-black text-white tracking-tighter mb-4">
             THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-pl-cyan to-white">CREATOR</span>
           </h1>
           <p className="text-pl-gray text-lg font-medium max-w-xl mx-auto">
             Architecting digital experiences with passion and precision.
           </p>
        </div>

        {/* Profile Card */}
        <div className="bg-[#2c0030] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden relative group">
           {/* Decorative Top Border */}
           <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-pl-pink via-white to-pl-cyan"></div>
           
           <div className="grid grid-cols-1 lg:grid-cols-3">
              
              {/* Left: Photo/Info Column */}
              <div className="bg-[#240026] p-10 flex flex-col items-center text-center border-b lg:border-b-0 lg:border-r border-white/5 relative">
                 {/* Profile Picture */}
                 <div className="relative w-48 h-48 mb-8 group-hover:scale-105 transition-transform duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-pl-cyan to-pl-pink rounded-full blur opacity-20 animate-pulse"></div>
                    <div className="w-full h-full rounded-full p-1.5 bg-gradient-to-br from-pl-cyan to-pl-pink relative z-10">
                        <div className="w-full h-full rounded-full bg-pl-primary overflow-hidden border-4 border-[#240026]">
                            {/* Ganti src dengan foto profil kamu */}
                            <img 
                                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=400&h=400" 
                                alt="Creator" 
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                            />
                        </div>
                    </div>
                 </div>

                 <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Jibran</h2>
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8">
                    <Cpu size={14} className="text-pl-cyan"/>
                    <span className="text-[10px] font-black text-pl-cyan uppercase tracking-widest">Fullstack Developer</span>
                 </div>
                 
                 <div className="flex gap-4 mt-auto">
                    <SocialButton icon={<Github size={20}/>} href="https://github.com/jibrananlt" />
                    <SocialButton icon={<Linkedin size={20}/>} href="#" />
                    <SocialButton icon={<Instagram size={20}/>} href="#" />
                    <SocialButton icon={<Mail size={20}/>} href="#" />
                 </div>
              </div>

              {/* Right: Bio & Stack Column */}
              <div className="col-span-2 p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-[#2c0030] to-[#240026]">
                 <div className="mb-10">
                    <h3 className="text-xl font-black text-white uppercase tracking-wide mb-4 flex items-center gap-3">
                        <span className="w-2 h-8 bg-pl-pink rounded-full"></span> Biography
                    </h3>
                    <p className="text-pl-gray leading-relaxed text-base md:text-lg font-medium">
                        Hello! I'm a passionate software engineer dedicated to building modern, high-performance web applications. 
                        This project, <span className="text-white font-bold">Premier League API</span>, showcases my ability to craft pixel-perfect interfaces using 
                        <span className="text-pl-cyan font-bold"> React</span> & <span className="text-pl-cyan font-bold">Tailwind CSS</span>, 
                        powered by a robust backend infrastructure. I believe in writing clean code and delivering exceptional user experiences.
                    </p>
                 </div>

                 <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-wide mb-6 flex items-center gap-3">
                        <span className="w-2 h-8 bg-pl-cyan rounded-full"></span> Tech Stack
                    </h3>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <TechCard icon={<Code2 size={24}/>} title="Frontend" desc="React + Vite" color="text-blue-400" />
                        <TechCard icon={<Layout size={24}/>} title="Styling" desc="Tailwind CSS" color="text-cyan-400" />
                        <TechCard icon={<Server size={24}/>} title="Backend" desc="Next.js API" color="text-white" />
                        <TechCard icon={<Database size={24}/>} title="Database" desc="MySQL + Prisma" color="text-orange-400" />
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Footer Credit */}
        <div className="text-center mt-16 pb-8 border-t border-white/5 pt-8">
           <p className="text-pl-gray font-bold text-xs uppercase tracking-[0.2em] opacity-50 hover:opacity-100 transition-opacity">
             Designed & Developed by Jibran © 2025
           </p>
        </div>

      </div>
    </div>
  );
}

// --- Sub Components ---

function SocialButton({ icon, href }: { icon: React.ReactNode, href: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-2xl bg-black/30 border border-white/5 flex items-center justify-center text-pl-gray hover:text-white hover:bg-pl-cyan hover:text-pl-primary hover:scale-110 hover:shadow-[0_0_15px_rgba(0,255,133,0.4)] transition-all duration-300">
      {icon}
    </a>
  )
}

function TechCard({ icon, title, desc, color }: { icon: React.ReactNode, title: string, desc: string, color: string }) {
  return (
    <div className="bg-black/20 p-5 rounded-2xl border border-white/5 hover:border-pl-cyan/30 hover:bg-white/5 transition-all group/card cursor-default">
       <div className={`${color} mb-3 group-hover/card:scale-110 transition-transform duration-300 drop-shadow-md`}>{icon}</div>
       <div className="text-sm font-black text-white mb-1 tracking-wide">{title}</div>
       <div className="text-[10px] font-bold text-pl-gray uppercase tracking-wider">{desc}</div>
    </div>
  )
}