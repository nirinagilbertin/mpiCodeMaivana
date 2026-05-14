import React, { useEffect, useState } from 'react';
import { reportService } from '../../services/reportService';
import { FadeIn, Card, Button, Loader, Modal, Input } from '../../components';
import { CheckCircle, XCircle, Eye } from 'lucide-react';

const ReportsModeration = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [statusAction, setStatusAction] = useState('');
  const [adminComment, setAdminComment] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await reportService.getAll({ status: 'pending', limit: 50 });
      setReports(res.data.data.reports);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (report, newStatus) => {
    setSelectedReport(report);
    setStatusAction(newStatus);
    setAdminComment('');
    setModalOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedReport) return;
    try {
      await reportService.updateStatus(selectedReport.id, statusAction, adminComment);
      setModalOpen(false);
      fetchReports();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Loader />;

  return (
    <FadeIn>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Modération des signalements</h1>
        <p className="text-gray-500">Signalements en attente de validation</p>
        <div className="space-y-3">
          {reports.length === 0 && <p className="text-gray-500">Aucun signalement en attente.</p>}
          {reports.map(report => (
            <Card key={report.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{report.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{report.description.substring(0, 100)}...</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{report.Category?.name}</span>
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">{report.urgency}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => window.open(`/reports/${report.id}`, '_blank')} icon={Eye}>Voir</Button>
                  <Button size="sm" variant="outline" className="border-green-500 text-green-600" onClick={() => handleStatusChange(report, 'validated')} icon={CheckCircle}>Valider</Button>
                  <Button size="sm" variant="outline" className="border-red-500 text-red-600" onClick={() => handleStatusChange(report, 'rejected')} icon={XCircle}>Rejeter</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Confirmer la modification">
          <div className="space-y-4">
            <p>Signalement : <strong>{selectedReport?.title}</strong></p>
            <p>Nouveau statut : <strong>{statusAction === 'validated' ? 'Validé' : 'Rejeté'}</strong></p>
            <Input
              label="Commentaire (optionnel)"
              value={adminComment}
              onChange={(e) => setAdminComment(e.target.value)}
              placeholder="Ajouter un commentaire pour le citoyen..."
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setModalOpen(false)}>Annuler</Button>
              <Button onClick={confirmStatusChange}>Confirmer</Button>
            </div>
          </div>
        </Modal>
      </div>
    </FadeIn>
  );
};

export default ReportsModeration;