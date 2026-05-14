import { useRef, useState, type ChangeEvent } from "react";
import { Upload, X } from "lucide-react";
import Button from "./Button";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
  maxSizeMB?: number;
  preview?: string | null;
}

export default function FileUpload({
  onFileSelect,
  accept = "image/*",
  maxSizeMB = 5,
  preview: initialPreview,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(
    initialPreview || null
  );
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`L'image ne doit pas dépasser ${maxSizeMB} Mo`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    onFileSelect(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-gray-200">
          <img
            src={preview}
            alt="Aperçu"
            className="w-full h-48 object-cover"
          />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
            aria-label="Supprimer l'image"
          >
            <X size={16} className="text-gray-600" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center gap-2 hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
        >
          <Upload size={24} className="text-gray-400" />
          <span className="text-sm text-gray-500">
            Cliquez pour ajouter une photo
          </span>
          <span className="text-xs text-gray-400">Max {maxSizeMB} Mo</span>
        </button>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}