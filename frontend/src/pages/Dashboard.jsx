import React, { useEffect, useState } from 'react';
import { adminService } from '../services/adminService';
import { categoryService } from '../services/categoryService';
import { FadeIn, Card, Loader, Button, Input, Textarea, Modal } from '../components';
import BarChart from '../components/BarChart';
import LineChart from '../components/LineChart';
import { 
  FileText, AlertTriangle, CheckCircle, TrendingUp, Users, Download, Plus, Edit, Trash2
} from 'lucide-react';

const Dashboard = () => {
  const [overview, setOverview] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [evolutionData, setEvolutionData] = useState(null);
  const [topNeighborhoods, setTopNeighborhoods] = useState([]);
  const [recentActivities, setRecentActivities] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ name: '', icon: '', color: '#6c757d', isActive: true });
  const [loading, setLoading] = useState(true);
  const [generatingReport, setGeneratingReport] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [overviewRes, categoryRes, evolutionRes, neighborhoodsRes, activitiesRes, categoriesRes] = await Promise.all([
        adminService.getDashboardOverview(),
        adminService.getReportsByCategory(),
        adminService.getReportsEvolution(30),
        adminService.getTopNeighborhoods(),
        adminService.getRecentActivities(),
        categoryService.getAll(true),
      ]);
      setOverview(overviewRes.data.data);
      prepareCategoryChart(categoryRes.data.data);
      prepareEvolutionChart(evolutionRes.data.data);
      setTopNeighborhoods(neighborhoodsRes.data.data);
      setRecentActivities(activitiesRes.data.data);
      setCategories(categoriesRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const prepareCategoryChart = (data) => {
    const labels = data.map(item => item.Category.name);
    const counts = data.map(item => item.dataValues.count);
    setCategoryData({
      labels,
      datasets: [{
        label: 'Nombre de signalements',
        data: counts,
        backgroundColor: 'rgba(26, 31, 38, 0.7)',
        borderRadius: 8,
      }],
    });
  };

  const prepareEvolutionChart = (data) => {
    const labels = data.map(item => item.date);
    const counts = data.map(item => item.count);
    setEvolutionData({
      labels,
      datasets: [{
        label: 'Signalements par jour',
        data: counts,
        borderColor: '#1A1F26',
        backgroundColor: 'rgba(26, 31, 38, 0.1)',
        tension: 0.3,
        fill: true,
      }],
    });
  };

  const handleGenerateReport = async () => {
    setGeneratingReport(true);
    try {
      const res = await adminService.generateReport('week');
      const dataStr = JSON.stringify(res.data.data, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport_${new Date().toISOString()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingReport(false);
    }
  };

  const handleCreateCategory = async () => {
    try {
      await categoryService.create(categoryForm);
      setShowCategoryModal(false);
      setCategoryForm({ name: '', icon: '', color: '#6c757d', isActive: true });
      fetchDashboardData(); // Refresh categories
    } catch (err) {
      console.error('Erreur création catégorie:', err);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      try {
        await categoryService.delete(id);
        fetchDashboardData(); // Refresh categories
      } catch (err) {
        console.error('Erreur suppression catégorie:', err);
      }
    }
  };

  if (loading) return <Loader />;

  const stats = overview?.reports || {};
  const users = overview?.users || {};
  const engagement = overview?.engagement || {};

  const kpiItems = [
    { label: 'Signalements totaux', value: stats.total, icon: FileText, color: 'bg-blue-100 text-blue-800' },
    { label: 'Actifs (validés/en cours)', value: stats.active, icon: AlertTriangle, color: 'bg-orange-100 text-orange-800' },
    { label: 'Résolus', value: stats.resolved, icon: CheckCircle, color: 'bg-green-100 text-green-800' },
    { label: 'Urgents critiques', value: stats.urgent, icon: TrendingUp, color: 'bg-red-100 text-red-800' },
    { label: 'Utilisateurs actifs', value: users.totalActive, icon: Users, color: 'bg-purple-100 text-purple-800' },
    { label: 'Publications modérées', value: engagement.posts, icon: FileText, color: 'bg-gray-100 text-gray-800' },
  ];

  return (
    <FadeIn>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Tableau de bord administrateur</h1>
          <Button onClick={handleGenerateReport} disabled={generatingReport} icon={Download}>
            {generatingReport ? 'Génération...' : 'Rapport (semaine)'}
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpiItems.map((item, idx) => (
            <Card key={idx} className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="text-2xl font-bold">{item.value ?? 0}</p>
              </div>
              <div className={`p-3 rounded-full ${item.color}`}>
                <item.icon size={24} />
              </div>
            </Card>
          ))}
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Signalements par catégorie</h3>
            <div className="h-80">
              {categoryData && <BarChart data={categoryData} />}
            </div>
          </Card>
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Évolution (30 derniers jours)</h3>
            <div className="h-80">
              {evolutionData && <LineChart data={evolutionData} />}
            </div>
          </Card>
        </div>

        {/* Gestion des catégories */}
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Gestion des catégories</h3>
            <Button onClick={() => setShowCategoryModal(true)} icon={Plus} size="sm">
              Nouvelle catégorie
            </Button>
          </div>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex justify-between items-center p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className={category.isActive ? '' : 'text-gray-400 line-through'}>
                    {category.name}
                  </span>
                  {!category.isActive && <span className="text-xs text-gray-500">(inactive)</span>}
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleDeleteCategory(category.id)} 
                    variant="danger" 
                    size="sm" 
                    icon={Trash2}
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quartiers les plus touchés */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Top 5 quartiers les plus signalés</h3>
          <div className="space-y-2">
            {topNeighborhoods.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center border-b pb-2">
                <span>{item.address || 'Adresse non précisée'}</span>
                <span className="font-semibold">{item.count} signalements</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Activités récentes */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Activités récentes</h3>
          <div className="space-y-3">
            {recentActivities?.reports?.slice(0, 3).map(report => (
              <div key={report.id} className="flex justify-between text-sm">
                <span>📋 Signalement: {report.title}</span>
                <span className="text-gray-500">{new Date(report.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
            {recentActivities?.posts?.slice(0, 3).map(post => (
              <div key={post.id} className="flex justify-between text-sm">
                <span>📝 Publication: {post.content.substring(0, 50)}...</span>
                <span className="text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Modal création catégorie */}
        <Modal 
          isOpen={showCategoryModal} 
          onClose={() => setShowCategoryModal(false)}
          title="Créer une nouvelle catégorie"
        >
          <div className="space-y-4">
            <Input
              label="Nom de la catégorie"
              value={categoryForm.name}
              onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
              placeholder="Ex: Eau potable"
              required
            />
            <Input
              label="Icône (optionnel)"
              value={categoryForm.icon}
              onChange={(e) => setCategoryForm({...categoryForm, icon: e.target.value})}
              placeholder="Ex: 💧"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Couleur
              </label>
              <input
                type="color"
                value={categoryForm.color}
                onChange={(e) => setCategoryForm({...categoryForm, color: e.target.value})}
                className="w-full h-10 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={categoryForm.isActive}
                onChange={(e) => setCategoryForm({...categoryForm, isActive: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="isActive" className="text-sm">Catégorie active</label>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowCategoryModal(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreateCategory} disabled={!categoryForm.name.trim()}>
                Créer
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </FadeIn>
  );
};

export default Dashboard;