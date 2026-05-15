import { useState } from "react";
import { mockPharmacies } from "../mocks/resources";
import { Pharmacy } from "../types/resources";
import { motion } from "framer-motion";
import { Pill, Search, Plus, Shield, X } from "lucide-react";
import { useAuthContext } from "../context/AuthContext";
import ResourceMap from "../components/resources/ResourceMap";
import ZoneCard from "../components/resources/ZoneCard";

export default function ResourcePage() {
  const { isAdmin } = useAuthContext();
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>(mockPharmacies);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const onDutyCount = pharmacies.filter(p => p.isOnDuty).length;
  const offDutyCount = pharmacies.filter(p => !p.isOnDuty).length;

  const filteredPharmacies = pharmacies.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleDuty = (pharmacyId: string) => {
    if (!isAdmin) return;
    setPharmacies(prev =>
      prev.map(p =>
        p.id === pharmacyId
          ? {
              ...p,
              isOnDuty: !p.isOnDuty,
              ...(p.isOnDuty
                ? { dutyStart: undefined, dutyEnd: undefined }
                : {
                    dutyStart: new Date().toISOString(),
                    dutyEnd: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
                  }
              ),
            }
          : p
      )
    );
  };

  const handlePharmacyClick = (pharmacy: Pharmacy) => {
    setSelectedPharmacy(pharmacy);
    // Centrer la carte sur la pharmacie sélectionnée
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-emerald-50/20">
      {/* === HEADER === */}
      <header className="bg-white/90 backdrop-blur-md border-b border-emerald-100 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-md shadow-emerald-200">
            <Pill size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Pharmacies de Garde
            </h1>
            <p className="text-xs text-gray-500">Fianarantsoa • {pharmacies.length} pharmacies</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Badge admin */}
          {isAdmin && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-full text-xs font-medium text-purple-700">
              <Shield size={12} />
              Mode Admin
            </div>
          )}

          {/* Bouton ajouter (admin seulement) */}
          {isAdmin && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors shadow-sm"
            >
              <Plus size={16} />
              Ajouter
            </button>
          )}
        </div>
      </header>

      {/* === CONTENU PRINCIPAL === */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Panneau Gauche — Liste des pharmacies */}
        <motion.aside
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-full lg:w-80 bg-white border-r border-gray-200 flex flex-col shrink-0"
        >
          {/* Barre de recherche */}
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une pharmacie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Stats rapides */}
          <div className="px-4 py-3 border-b border-gray-100 flex gap-3">
            <div className="flex-1 bg-emerald-50 rounded-lg p-2 text-center">
              <span className="text-lg font-bold text-emerald-700">{onDutyCount}</span>
              <p className="text-[10px] text-emerald-600 uppercase tracking-wide">En garde</p>
            </div>
            <div className="flex-1 bg-amber-50 rounded-lg p-2 text-center">
              <span className="text-lg font-bold text-amber-700">{offDutyCount}</span>
              <p className="text-[10px] text-amber-600 uppercase tracking-wide">Non gardées</p>
            </div>
          </div>

          {/* Liste */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredPharmacies.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Pill size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Aucune pharmacie trouvée</p>
              </div>
            ) : (
              filteredPharmacies.map(pharmacy => (
                <ZoneCard
                  key={pharmacy.id}
                  pharmacy={pharmacy}
                  isAdmin={isAdmin}
                  onToggleDuty={toggleDuty}
                  onClick={() => handlePharmacyClick(pharmacy)}
                />
              ))
            )}
          </div>
        </motion.aside>

        {/* Centre — Carte */}
        <main className="flex-1 relative min-h-0">
          <ResourceMap
            pharmacies={filteredPharmacies}
            onPharmacyClick={handlePharmacyClick}
          />

          {/* Légende */}
          <div className="absolute bottom-4 left-4 z-[700] bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg border border-gray-200">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Légende</p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                En garde
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                Non gardée
              </div>
            </div>
          </div>
        </main>

        {/* Panneau Droit — Détail (si pharmacie sélectionnée) */}
        {selectedPharmacy && (
          <motion.aside
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-full lg:w-72 bg-white border-l border-gray-200 overflow-y-auto shrink-0 p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Détail
              </h2>
              <button
                onClick={() => setSelectedPharmacy(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div className={`p-4 rounded-xl ${selectedPharmacy.isOnDuty ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Pill size={20} className={selectedPharmacy.isOnDuty ? 'text-emerald-600' : 'text-amber-600'} />
                  <h3 className="font-semibold text-gray-900">{selectedPharmacy.name}</h3>
                </div>
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
                  selectedPharmacy.isOnDuty ? 'bg-emerald-500 text-white' : 'bg-amber-200 text-amber-800'
                }`}>
                  {selectedPharmacy.isOnDuty ? 'En garde' : 'Non gardée'}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Adresse :</strong> {selectedPharmacy.address}</p>
                <p><strong>Téléphone :</strong> {selectedPharmacy.phone}</p>
                {selectedPharmacy.isOnDuty && selectedPharmacy.dutyStart && (
                  <p><strong>Début garde :</strong> {new Date(selectedPharmacy.dutyStart).toLocaleString('fr-FR')}</p>
                )}
                {selectedPharmacy.isOnDuty && selectedPharmacy.dutyEnd && (
                  <p><strong>Fin garde :</strong> {new Date(selectedPharmacy.dutyEnd).toLocaleString('fr-FR')}</p>
                )}
              </div>
            </div>
          </motion.aside>
        )}
      </div>
    </div>
  );
}