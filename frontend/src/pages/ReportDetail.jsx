import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { reportService } from '../services/reportService';
import { FadeIn, Card, Button, Loader, Modal } from '../components';
import { ArrowLeft, MapPin, Calendar, AlertCircle, CheckCircle, XCircle, Edit } from 'lucide-react';

const statusLabels = {
  pending: 'En attente',
  validated: 'Validé',
  in_progress: 'En cours',
  resolved: 'Résolu',
  rejected: 'Rejeté',
};

const urgencyColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
};

const ReportDetail = () => {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusModal, setStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [adminComment, setAdminComment] = useState('');

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      const res = await reportService.getById(id);
      setReport(res.data.data);
    } catch (err) {
      console.error(err);
      navigate('/reports');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      await reportService.updateStatus(id, newStatus, adminComment);
      setStatusModal(false);
      fetchReport();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Loader />;
  if (!report) return null;

  return (
    <FadeIn>
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-500 hover:text-primary mb-4">
          <ArrowLeft size={18} /> Retour
        </button>

        <Card className="overflow-hidden">
          {report.photoUrl && (
            <img src={report.photoUrl} alt="signalement" className="w-full h-64 object-cover" />
          )}
          <div className="p-6 space-y-5">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-bold">{report.title}</h1>
              <div className="flex gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${urgencyColors[report.urgency]}`}>
                  {report.urgency}
                </span>
                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                  {statusLabels[report.status]}
                </span>
              </div>
            </div>

            <div className="flex gap-3 text-sm text-gray-500">
              <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(report.createdAt).toLocaleDateString()}</span>
              <span className="flex items-center gap-1"><MapPin size={14} /> {report.address || 'Position GPS'}</span>
            </div>

            <div>
              <h3 className="font-semibold mb-1">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{report.description}</p>
            </div>

            {report.adminComment && (
              <div className="bg-gray-50 p-3 rounded-xl">
                <h4 className="font-medium text-sm">Commentaire admin</h4>
                <p className="text-sm text-gray-600">{report.adminComment}</p>
              </div>
            )}

            {isAdmin && (
              <div className="border-t pt-4 flex gap-3">
                <Button variant="outline" onClick={() => setStatusModal(true)}>Changer le statut</Button>
              </div>
            )}

            {report.resolvedAt && (
              <div className="text-sm text-green-600 flex items-center gap-1">
                <CheckCircle size={16} /> Résolu le {new Date(report.resolvedAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </Card>

        <Modal isOpen={statusModal} onClose={() => setStatusModal(false)} title="Mise à jour du statut">
          <div className="space-y-4">
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full border rounded-xl p-2"
            >
              <option value="">Sélectionner un statut</option>
              {Object.entries(statusLabels).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
            <textarea
              placeholder="Commentaire (optionnel)"
              value={adminComment}
              onChange={(e) => setAdminComment(e.target.value)}
              rows={3}
              className="w-full border rounded-xl p-2"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setStatusModal(false)}>Annuler</Button>
              <Button onClick={handleStatusUpdate}>Enregistrer</Button>
            </div>
          </div>
        </Modal>
      </div>
    </FadeIn>
  );
};

export default ReportDetail;