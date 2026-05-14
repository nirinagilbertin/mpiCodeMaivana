import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportService, categoryService } from '../services/reportService';
import { FadeIn, Card, Input, Textarea, Button, Loader } from '../components';
import { MapPin, AlertTriangle, Camera, Send } from 'lucide-react';

const CreateReport = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    categoryId: '',
    urgency: 'medium',
    latitude: '',
    longitude: '',
    address: '',
    photoUrl: '',
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gettingLocation, setGettingLocation] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getAll();
      setCategories(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Géolocalisation non supportée');
      return;
    }
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm(prev => ({
          ...prev,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }));
        setGettingLocation(false);
      },
      (err) => {
        console.error(err);
        alert('Impossible d\'obtenir votre position');
        setGettingLocation(false);
      }
    );
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.categoryId || !form.latitude || !form.longitude) {
      setError('Veuillez remplir tous les champs obligatoires (titre, description, catégorie, position)');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await reportService.create(form);
      navigate('/reports');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FadeIn>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Nouveau signalement</h1>
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="bg-red-50 text-red-700 p-3 rounded-xl text-sm">{error}</div>}

            <Input
              label="Titre *"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Ex: Fuite d'eau rue du marché"
            />

            <Textarea
              label="Description *"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Décrivez le problème..."
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl py-2 px-3"
                required
              >
                <option value="">Sélectionnez une catégorie</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Urgence</label>
              <select
                name="urgency"
                value={form.urgency}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl py-2 px-3"
              >
                <option value="low">Faible</option>
                <option value="medium">Moyenne</option>
                <option value="high">Haute</option>
                <option value="critical">Critique</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Localisation *</label>
              <div className="flex gap-2">
                <Input
                  name="latitude"
                  placeholder="Latitude"
                  value={form.latitude}
                  onChange={handleChange}
                  className="flex-1"
                />
                <Input
                  name="longitude"
                  placeholder="Longitude"
                  value={form.longitude}
                  onChange={handleChange}
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={getCurrentLocation} disabled={gettingLocation}>
                  {gettingLocation ? <Loader /> : <MapPin size={18} />}
                </Button>
              </div>
            </div>

            <Input
              label="Adresse (optionnel)"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Rue, quartier..."
            />

            <Input
              label="URL de la photo (optionnel)"
              name="photoUrl"
              value={form.photoUrl}
              onChange={handleChange}
              placeholder="https://..."
            />

            <Button type="submit" disabled={loading} icon={Send} fullWidth>
              {loading ? 'Envoi...' : 'Publier le signalement'}
            </Button>
          </form>
        </Card>
      </div>
    </FadeIn>
  );
};

export default CreateReport;