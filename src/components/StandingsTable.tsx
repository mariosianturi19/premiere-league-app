import type { Standing } from '../types';

export default function StandingsTable({ data }: { data: Standing[] }) {
  return (
    <div className="bg-[#2c0030] rounded-[1.5rem] overflow-hidden border border-white/5 shadow-2xl relative">
      {/* Header Gradient Bar */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-pl-cyan via-white to-pl-pink"></div>

      <div className="p-6 md:p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-1">
            Premier League Table
          </h3>
          <p className="text-pl-gray text-xs font-medium">Matchweek 38</p>
        </div>
        <div className="flex gap-2">
           <span className="text-[10px] font-bold text-pl-primary bg-pl-cyan px-3 py-1.5 rounded uppercase tracking-wider">UCL</span>
           <span className="text-[10px] font-bold text-white bg-pl-pink px-3 py-1.5 rounded uppercase tracking-wider">Relegation</span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-pl-primary/50 text-pl-gray font-bold text-[11px] uppercase tracking-wider border-b border-white/5">
            <tr>
              <th className="px-6 py-4 text-center w-16">Pos</th>
              <th className="px-6 py-4">Club</th>
              <th className="px-4 py-4 text-center">Pl</th>
              <th className="px-4 py-4 text-center hidden sm:table-cell">W</th>
              <th className="px-4 py-4 text-center hidden sm:table-cell">D</th>
              <th className="px-4 py-4 text-center hidden sm:table-cell">L</th>
              <th className="px-4 py-4 text-center">GD</th>
              <th className="px-6 py-4 text-center text-white font-black">Pts</th>
              <th className="px-6 py-4 text-center">Form</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-[#2c0030]">
            {data.map((row, index) => {
              const rank = index + 1;
              let posClass = "text-pl-gray";
              if (rank <= 4) posClass = "text-pl-primary bg-pl-cyan rounded-md w-6 h-6 flex items-center justify-center font-black mx-auto shadow-[0_0_10px_rgba(0,255,133,0.5)]";
              else if (rank >= data.length - 2) posClass = "text-white bg-pl-pink rounded-md w-6 h-6 flex items-center justify-center font-black mx-auto shadow-[0_0_10px_rgba(233,0,82,0.5)]";

              // Dummy form data (W-W-D-L-W) randomized for visual
              const forms = Array(5).fill(0).map(() => Math.random() > 0.5 ? 'W' : Math.random() > 0.5 ? 'D' : 'L');

              return (
                <tr key={row.id} className="hover:bg-[#38003c] transition duration-200 group cursor-default">
                  <td className="px-6 py-5 text-center font-bold">
                    <div className={posClass}>{rank}</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 p-1 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        {row.team.logo ? <img src={row.team.logo} className="w-full h-full object-contain" /> : <div className="w-full h-full bg-gray-200 rounded-full"/>}
                      </div>
                      <span className="font-bold text-white text-base tracking-tight group-hover:text-pl-cyan transition-colors">{row.team.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-5 text-center font-bold text-white/90">{row.played}</td>
                  <td className="px-4 py-5 text-center text-pl-gray hidden sm:table-cell">{row.won}</td>
                  <td className="px-4 py-5 text-center text-pl-gray hidden sm:table-cell">{row.drawn}</td>
                  <td className="px-4 py-5 text-center text-pl-gray hidden sm:table-cell">{row.lost}</td>
                  <td className="px-4 py-5 text-center font-bold text-pl-gray">
                    {row.goalsFor - row.goalsAgainst > 0 ? `+${row.goalsFor - row.goalsAgainst}` : row.goalsFor - row.goalsAgainst}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="font-black text-lg text-white tracking-tighter group-hover:scale-125 inline-block transition-transform duration-300">
                      {row.points}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex gap-1 justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                      {forms.map((f, i) => (
                        <span key={i} className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black text-white 
                          ${f === 'W' ? 'bg-green-500' : f === 'D' ? 'bg-gray-500' : 'bg-pl-pink'}`}>
                          {f}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}