import { Github, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#240026] border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img 
                src="https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Premier_League_Logo.svg/1200px-Premier_League_Logo.svg.png" 
                alt="Premier League Logo" 
                className="w-10 h-10 object-contain" 
              />
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter text-white leading-none">PREMIER<span className="text-pl-cyan">LEAGUE</span></span>
                <span className="text-[10px] font-bold tracking-[0.2em] text-pl-gray uppercase">Information</span>
              </div>
            </div>
            <p className="text-pl-gray text-sm leading-relaxed max-w-sm mb-6">
              The ultimate destination for Premier League fans. Get live scores, stats, news, and exclusive insights about the world's best football league.
            </p>
            <div className="flex gap-4">
              <SocialLink href="https://github.com/mariosianturi19" icon={<Github size={18} />} />
              <SocialLink href="https://www.linkedin.com/in/togar-anthony-mario-sianturi/" icon={<Linkedin size={18} />} />
              <SocialLink href="https://www.instagram.com/mariosianturii/" icon={<Instagram size={18} />} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <FooterLink to="/" label="Home" />
              <FooterLink to="/teams" label="Clubs" />
              <FooterLink to="/matches" label="Fixtures" />
              <FooterLink to="/about" label="About Creator" />
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-pl-gray text-xs font-medium">
            © 2025 Premier League Information. All rights reserved.
          </p>
          <p className="text-pl-gray text-xs font-medium flex items-center gap-1">
            Designed by <span className="text-white font-bold">Togar Anthony Mario Sianturi</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-pl-gray hover:bg-pl-cyan hover:text-pl-primary transition-all duration-300"
    >
      {icon}
    </a>
  );
}

function FooterLink({ to, label }: { to: string; label: string }) {
  return (
    <li>
      <Link to={to} className="text-pl-gray text-sm hover:text-pl-cyan transition-colors">
        {label}
      </Link>
    </li>
  );
}
