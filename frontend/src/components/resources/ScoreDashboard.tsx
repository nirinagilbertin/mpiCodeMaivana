// import { useMemo } from 'react';
// import { SimulationState } from '../../types/resources';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
// import { getZoneColor } from '../../utils/scoring';

// export default function ScoreDashboard({ scores, zones }: Pick<SimulationState, 'scores' | 'zones'>) {
//   const chartData = useMemo(() => {
//     return scores.map(s => ({
//       name: zones.find(z => z.id === s.zoneId)?.name || s.zoneId,
//       score: Math.round(s.score * 100),
//       color: getZoneColor(s.level),
//     }));
//   }, [scores, zones]);

//   const criticalCount = scores.filter(s => s.level === 'critical').length;
//   const warningCount = scores.filter(s => s.level === 'warning').length;

//   return (
//     <div className="space-y-4">
//       <div className="flex gap-4">
//         <div className="flex-1 bg-red-50 rounded-xl p-3 text-center">
//           <div className="text-2xl font-bold text-red-700">{criticalCount}</div>
//           <div className="text-xs text-red-600">Critiques</div>
//         </div>
//         <div className="flex-1 bg-amber-50 rounded-xl p-3 text-center">
//           <div className="text-2xl font-bold text-amber-700">{warningCount}</div>
//           <div className="text-xs text-amber-600">Alertes</div>
//         </div>
//       </div>

//       <div className="h-48">
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
//             <XAxis dataKey="name" tick={false} />
//             <YAxis domain={[0, 100]} />
//             <Tooltip />
//             <Bar dataKey="score" radius={[4, 4, 0, 0]}>
//               {chartData.map((entry, index) => (
//                 <Cell key={index} fill={entry.color} />
//               ))}
//             </Bar>
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }