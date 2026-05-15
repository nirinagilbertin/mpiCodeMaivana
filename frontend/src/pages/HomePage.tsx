import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  AlertTriangle,
  BarChart3,
  ArrowRight,
  Shield,
  Users,
  Zap,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useReportsStats } from "../hooks/useReports";
import { useAuthContext } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Spinner from "../components/ui/Spinner";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerChildren = {
  animate: {
    transition: { staggerChildren: 0.1 },
  },
};

export default function HomePage() {
  const { stats, loading } = useReportsStats();
  const { user } = useAuthContext();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        {/* Motif de fond */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-28">
          <motion.div
            className="max-w-3xl"
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm mb-6"
            >
              <Zap size={14} className="text-yellow-300" />
              <span>Plateforme officielle de Fianarantsoa</span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6"
            >
              Votre ville,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                plus intelligente
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg text-blue-100 leading-relaxed mb-8 max-w-2xl"
            >
              Signalez les problèmes de votre quartier, suivez les interventions
              en temps réel et contribuez à l'amélioration de Fianarantsoa.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/new-report">
                <Button
                  size="lg"
                  className="text-blue-700 hover:bg-blue-50 shadow-xl"
                  icon={<AlertTriangle size={20} />}
                >
                  Signaler un problème
                </Button>
              </Link>
              <Link to="/map">
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-white border border-white/30 hover:bg-white/10"
                  icon={<MapPin size={20} />}
                >
                  Voir la carte
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Vague de transition */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 60V30C240 0 480 0 720 15C960 30 1200 45 1440 30V60H0Z"
              fill="#F9FAFB"
            />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-10 relative z-10 pb-16">
        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner size="lg" />
          </div>
        ) : stats ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {[
              {
                label: "Signalements",
                value: stats.total,
                icon: AlertTriangle,
                color: "#3B82F6",
              },
              {
                label: "En attente",
                value: stats.pending,
                icon: Clock,
                color: "#F59E0B",
              },
              {
                label: "En cours",
                value: stats.inProgress,
                icon: Shield,
                color: "#8B5CF6",
              },
              {
                label: "Résolus",
                value: stats.resolved,
                icon: CheckCircle,
                color: "#10B981",
              },
            ].map((item) => (
              <Card key={item.label} padding="lg" className="text-center">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: item.color + "15" }}
                >
                  <item.icon size={22} style={{ color: item.color }} />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {item.value}
                </p>
                <p className="text-sm text-gray-500 mt-1">{item.label}</p>
              </Card>
            ))}
          </motion.div>
        ) : null}
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Comment ça marche ?
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Trois étapes simples pour améliorer votre ville
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              icon: AlertTriangle,
              title: "Signalez",
              description:
                "Prenez une photo, décrivez le problème et partagez votre position.",
              color: "#3B82F6",
            },
            {
              step: "02",
              icon: Users,
              title: "Collaborez",
              description:
                "Les autorités reçoivent votre signalement et interviennent rapidement.",
              color: "#8B5CF6",
            },
            {
              step: "03",
              icon: BarChart3,
              title: "Suivez",
              description:
                "Recevez des notifications et suivez l'évolution en temps réel.",
              color: "#10B981",
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <Card padding="lg" className="text-center h-full">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: feature.color + "15" }}
                >
                  <feature.icon size={26} style={{ color: feature.color }} />
                </div>
                <span
                  className="text-xs font-bold mb-2 inline-block"
                  style={{ color: feature.color }}
                >
                  ÉTAPE {feature.step}
                </span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              {user
                ? "Merci de contribuer à votre ville !"
                : "Prêt à améliorer Fianarantsoa ?"}
            </h2>
            <p className="text-blue-100 mb-8 max-w-xl mx-auto">
              {user
                ? "Chaque signalement compte. Continuez à rendre votre quartier meilleur."
                : "Rejoignez la communauté et aidez-nous à construire une ville plus connectée."}
            </p>
            <Link to={user ? "/new-report" : "/register"}>
              <Button
                size="lg"
                className="text-blue-700 hover:bg-blue-50 shadow-xl"
                icon={<ArrowRight size={20} />}
              >
                {user ? "Faire un signalement" : "Créer un compte"}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}