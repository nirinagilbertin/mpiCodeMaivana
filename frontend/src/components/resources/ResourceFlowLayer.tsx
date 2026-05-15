// import { useMemo } from 'react';
// import { useMap } from 'react-leaflet';
// import { motion } from 'framer-motion';
// import { ResourceFlow, ResourceZone } from '../../types/resources';
// import L from 'leaflet';

// interface FlowLayerProps {
//   zones: ResourceZone[];
//   flows: ResourceFlow[];
// }

// function toScreenPoint(map: L.Map, latlng: [number, number]) {
//   return map.latLngToContainerPoint(L.latLng(latlng[0], latlng[1]));
// }

// export default function ResourceFlowLayer({ zones, flows }: FlowLayerProps) {
//   const map = useMap();

//   const particles = useMemo(() => {
//     const items: { key: string; from: [number, number]; to: [number, number]; color: string }[] = [];
    
//     flows.forEach(flow => {
//       const fromZone = zones.find(z => z.id === flow.fromZoneId);
//       const toZone = zones.find(z => z.id === flow.toZoneId);
//       if (!fromZone || !toZone) return;

//       const color = flow.type === 'water' ? '#3B82F6' : '#F59E0B';
//       const count = flow.type === 'water' ? 6 : 4;

//       for (let i = 0; i < count; i++) {
//         items.push({
//           key: `${flow.fromZoneId}-${flow.toZoneId}-${i}-${Date.now()}`,
//           from: [fromZone.lat, fromZone.lng],
//           to: [toZone.lat, toZone.lng],
//           color,
//         });
//       }
//     });

//     return items;
//   }, [flows, zones]);

//   if (typeof window === 'undefined') return null;

//   return (
//     <div className="absolute inset-0 pointer-events-none z-[600]">
//       {particles.map(p => {
//         const fromPoint = toScreenPoint(map, p.from);
//         const toPoint = toScreenPoint(map, p.to);

//         return (
//           <motion.div
//             key={p.key}
//             initial={{ x: fromPoint.x, y: fromPoint.y, scale: 0, opacity: 0 }}
//             animate={{ x: toPoint.x, y: toPoint.y, scale: 1, opacity: 1 }}
//             exit={{ opacity: 0, scale: 0 }}
//             transition={{
//               duration: 2.5,
//               repeat: Infinity,
//               repeatDelay: Math.random() * 0.5,
//               ease: "easeInOut",
//             }}
//             className="absolute rounded-full"
//             style={{
//               width: 8,
//               height: 8,
//               backgroundColor: p.color,
//               boxShadow: `0 0 14px ${p.color}, 0 0 28px ${p.color}40`,
//             }}
//           />
//         );
//       })}
//     </div>
//   );
// }