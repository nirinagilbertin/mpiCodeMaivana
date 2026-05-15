import { useState, useCallback } from 'react';
import { TrashBin, TrashBinReport } from '../types/resources';
import { mockTrashBins } from '../mocks/trashBins';
import { useAuthContext } from '../context/AuthContext';

export function useTrashBins() {
  const { user } = useAuthContext();
  const [trashBins, setTrashBins] = useState<TrashBin[]>(mockTrashBins);
  const [reports, setReports] = useState<TrashBinReport[]>([]);
  const [lastReportedBin, setLastReportedBin] = useState<string | null>(null);

  const reportBin = useCallback((binId: string) => {
    if (!user) {
      return { success: false, message: 'Vous devez être connecté pour signaler.' };
    }

    // Convertir l'ID utilisateur en string pour éviter les problèmes de type
    const userId = String(user.id);

    // Vérifier si l'utilisateur a déjà signalé ce bac aujourd'hui
    const today = new Date().toDateString();
    const alreadyReported = reports.some(
      r => r.binId === binId && 
           r.userId === userId && 
           new Date(r.timestamp).toDateString() === today
    );

    if (alreadyReported) {
      return { success: false, message: 'Vous avez déjà signalé ce bac aujourd\'hui.' };
    }

    // Ajouter le signalement
    const newReport: TrashBinReport = {
      binId,
      userId,
      timestamp: new Date().toISOString(),
    };

    setReports(prev => [...prev, newReport]);
    
    setTrashBins(prev =>
      prev.map(bin => {
        if (bin.id !== binId) return bin;
        
        return {
          ...bin,
          reports: bin.reports + 1,
          reportedBy: [...(bin.reportedBy || []), userId],
        };
      })
    );
    
    setLastReportedBin(binId);

    return { success: true, message: 'Signalement enregistré. Merci !' };
  }, [user, reports]);

  const resetBinReports = useCallback((binId: string) => {
    setTrashBins(prev =>
      prev.map(bin =>
        bin.id === binId
          ? { ...bin, reports: 0, reportedBy: [], lastCollected: new Date().toISOString() }
          : bin
      )
    );
  }, []);

  return { trashBins, reports, lastReportedBin, reportBin, resetBinReports };
}