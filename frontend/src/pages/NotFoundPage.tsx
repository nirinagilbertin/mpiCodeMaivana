import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import Button from "../components/ui/Button";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center max-w-md"
      >
        <p className="text-8xl font-extrabold text-gray-200 mb-4">404</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Page introuvable
        </h1>
        <p className="text-gray-500 mb-8">
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/">
            <Button variant="primary" icon={<Home size={16} />}>
              Accueil
            </Button>
          </Link>
          <Button
            variant="secondary"
            icon={<ArrowLeft size={16} />}
            onClick={() => window.history.back()}
          >
            Retour
          </Button>
        </div>
      </motion.div>
    </div>
  );
}