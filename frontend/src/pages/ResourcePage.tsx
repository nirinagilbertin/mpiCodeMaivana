import { useResourceSimulation } from "../hooks/useResourceSimulation";
import ResourceMap from "../components/resources/ResourceMap";
import ResourceFlowLayer from "../components/resources/ResourceFlowLayer";
import ZoneCard from "../components/resources/ZoneCard";
import { motion } from "framer-motion";
import { Layers, Pause, Play, Droplets, Zap, AlertTriangle } from "lucide-react";

export default function ResourcePage() {
  const { zones, scores, flows, running, lastUpdate, togglePause } = useResourceSimulation();

  const criticalCount = scores.filter(s => s.status === 'critical').length;
  const warningCount = scores.filter(s => s.status === 'warning').length;
  const normalCount = scores.filter(s => s.status === 'normal').length;

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* === HEADER === */}
      <header className="bg-white/90 backdrop-blur-md border-b border-blue-100 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md shadow-blue-200">
            <Layers size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Centre de Distribution
            </h1>
            <p className="text-xs text-gray-500">Fianarantsoa • Monitoring temps réel</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Badge statut simulation */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
            running ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
          }`}>
            <span className={`w-2 h-2 rounded-full ${running ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
            {running ? 'Simulation active' : 'En pause'}
          </div>

          <button
            onClick={togglePause}
            className="p-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 hover:border-blue-200 transition-all shadow-sm"
            title={running ? 'Mettre en pause' : 'Démarrer'}
          >
            {running ? <Pause size={16} className="text-gray-600" /> : <Play size={16} className="text-blue-600" />}
          </button>

          <span className="text-xs text-gray-400 font-mono">
            {new Date(lastUpdate).toLocaleTimeString()}
          </span>
        </div>
      </header>

      {/* === CONTENU PRINCIPAL === */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Panneau Gauche — Liste des zones */}
        <motion.aside
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-full lg:w-80 bg-white border-r border-gray-200 overflow-y-auto shrink-0"
        >
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Zones surveillées
            </h2>
            <div className="flex gap-2 mt-3">
              <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg">
                <Droplets size={12} className="text-blue-500" />
                Eau
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg">
                <Zap size={12} className="text-amber-500" />
                Électricité
              </span>
            </div>
          </div>
          <div className="p-3 space-y-2">
            {zones.map(zone => (
              <ZoneCard key={zone.id} zone={zone} />
            ))}
          </div>
        </motion.aside>

        {/* Centre — Carte */}
        <main className="flex-1 relative min-h-0">
          <ResourceMap zones={zones} scores={scores}>
            <ResourceFlowLayer zones={zones} flows={flows} />
          </ResourceMap>

          {/* Légende superposée */}
          <div className="absolute bottom-4 left-4 z-[700] bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg border border-gray-200">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Légende</p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span className="w-3 h-3 rounded-full bg-red-500" /> Critique (&lt;30%)
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span className="w-3 h-3 rounded-full bg-amber-500" /> Alerte (30-55%)
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span className="w-3 h-3 rounded-full bg-emerald-500" /> Normal (&gt;55%)
              </div>
            </div>
          </div>
        </main>

        {/* Panneau Droit — Stats */}
        <motion.aside
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-full lg:w-72 bg-white border-l border-gray-200 overflow-y-auto shrink-0 p-5"
        >
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            État Global
          </h2>

          {/* Compteurs */}
          <div className="space-y-3 mb-6">
            <div className="bg-red-50 rounded-xl p-4 border border-red-100">
              <div className="flex items-center justify-between">
                <AlertTriangle size={20} className="text-red-500" />
                <span className="text-3xl font-bold text-red-700">{criticalCount}</span>
              </div>
              <p className="text-xs text-red-600 mt-1 font-medium">Zones critiques</p>
            </div>

            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
              <div className="flex items-center justify-between">
                <AlertTriangle size={20} className="text-amber-500" />
                <span className="text-3xl font-bold text-amber-700">{warningCount}</span>
              </div>
              <p className="text-xs text-amber-600 mt-1 font-medium">Zones en alerte</p>
            </div>

            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
              <div className="flex items-center justify-between">
                <div className="w-5 h-5 rounded-full bg-emerald-500" />
                <span className="text-3xl font-bold text-emerald-700">{normalCount}</span>
              </div>
              <p className="text-xs text-emerald-600 mt-1 font-medium">Zones normales</p>
            </div>
          </div>

          {/* Barre de progression globale */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-medium text-gray-500 mb-2">Niveau moyen global</p>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ 
                  width: `${zones.reduce((acc, z) => acc + z.level, 0) / zones.length}%` 
                }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1 text-right font-mono">
              {Math.round(zones.reduce((acc, z) => acc + z.level, 0) / zones.length)}%
            </p>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}