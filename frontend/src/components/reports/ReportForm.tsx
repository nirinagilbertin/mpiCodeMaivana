import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, AlertTriangle, Send, Camera } from "lucide-react";
import { useReports } from "../../hooks/useReports";
import { useCategories } from "../../hooks/useCategories";
import { useGeolocation } from "../../hooks/useGeolocation";
import { useAuth } from "../../context/AuthContext"; // 🔥 AJOUTÉ
import { URGENCY_LEVELS } from "../../config/constants";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import FileUpload from "../ui/FileUpload";
import AlertToast from "../ui/AlertToast";
import Card from "../ui/Card";

export default function ReportForm() {
  const navigate = useNavigate();
  const { addReport } = useReports();
  const { categories } = useCategories();
  const { latitude, longitude, loading: geoLoading } = useGeolocation();
  const { user } = useAuth(); // 🔥 AJOUTÉ

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: 0,
    urgency: "medium" as "low" | "medium" | "high" | "critical",
    photoUrl: undefined as string | undefined,
  });
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: "success" | "error";
  }>({ visible: false, message: "", type: "success" });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.categoryId) {
      setToast({
        visible: true,
        message: "Veuillez remplir le titre et choisir une catégorie.",
        type: "error",
      });
      return;
    }

    setSubmitting(true);
    
    // 🔥 MODIFIÉ : utiliser user.id
    const result = await addReport({
      title: formData.title,
      description: formData.description,
      categoryId: formData.categoryId,
      urgency: formData.urgency,
      latitude,
      longitude,
      photoUrl: formData.photoUrl,
      userId: user?.id || 2, // 🔥 ID de l'utilisateur connecté
    });

    setSubmitting(false);

    if (result) {
      setToast({
        visible: true,
        message: "Signalement créé avec succès !",
        type: "success",
      });
      setTimeout(() => navigate("/map"), 1500);
    } else {
      setToast({
        visible: true,
        message: "Erreur lors de la création du signalement.",
        type: "error",
      });
    }
  };

  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile);
    if (selectedFile) {
      setFormData((prev) => ({
        ...prev,
        photoUrl: URL.createObjectURL(selectedFile),
      }));
    } else {
      setFormData((prev) => ({ ...prev, photoUrl: undefined }));
    }
  };

  const urgencyOptions = Object.entries(URGENCY_LEVELS).map(([key, value]) => ({
    value: key,
    label: value.label,
  }));

  return (
    <>
      <AlertToast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
      />

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* En-tête */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <AlertTriangle size={20} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Nouveau signalement
            </h2>
            <p className="text-sm text-gray-500">
              Décrivez le problème que vous avez observé
            </p>
          </div>
        </div>

        <Card padding="lg">
          <div className="space-y-4">
            {/* Titre */}
            <Input
              label="Titre du signalement"
              placeholder="Ex: Fuite d'eau rue Principale"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              required
            />

            {/* Catégorie */}
            <Select
              label="Catégorie"
              placeholder="Choisir une catégorie"
              options={categories.map((cat) => ({
                value: cat.id,
                label: `${cat.icon || ""} ${cat.name}`,
              }))}
              value={formData.categoryId || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  categoryId: Number(e.target.value),
                }))
              }
              required
            />

            {/* Description */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={4}
                placeholder="Décrivez le problème en détail..."
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-150"
              />
            </div>

            {/* Niveau d'urgence */}
            <Select
              label="Niveau d'urgence"
              options={urgencyOptions}
              value={formData.urgency}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  urgency: e.target.value as typeof formData.urgency,
                }))
              }
            />

            {/* Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Photo (optionnelle)
              </label>
              <FileUpload
                onFileSelect={handleFileSelect}
                accept="image/*"
                maxSizeMB={5}
              />
            </div>

            {/* Position GPS */}
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-xl p-3">
              <MapPin size={16} className="text-blue-500 flex-shrink-0" />
              {geoLoading ? (
                <span>Détection de votre position...</span>
              ) : (
                <span>
                  Position : {latitude.toFixed(4)}, {longitude.toFixed(4)}
                </span>
              )}
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={submitting}
            icon={<Send size={16} />}
          >
            Envoyer le signalement
          </Button>
        </div>
      </form>
    </>
  );
}