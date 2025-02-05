import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            Fluorgan
          </h1>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/auth/login")}
            >
              {t("login")}
            </Button>
            <Button
              onClick={() => navigate("/auth/signup")}
            >
              {t("getStarted", "common")}
            </Button>
          </div>
        </div>
      </nav>

      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-500">
          {t("heroTitle", "landing")}
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
          {t("heroSubtitle", "landing")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={() => navigate("/auth/signup")}
            className="text-lg"
          >
            {t("startFreeTrialButton", "landing")}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/pricing")}
            className="text-lg"
          >
            {t("seePricingButton", "landing")}
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          {t("featuresTitle", "landing")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: t("feature1Title", "landing"),
              description: t("feature1Description", "landing"),
              icon: "✨"
            },
            {
              title: t("feature2Title", "landing"),
              description: t("feature2Description", "landing"),
              icon: "👥"
            },
            {
              title: t("feature3Title", "landing"),
              description: t("feature3Description", "landing"),
              icon: "⚡"
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="bg-primary-500 dark:bg-primary-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t("ctaTitle", "landing")}
          </h2>
          <p className="text-xl mb-8 text-primary-50">
            {t("ctaSubtitle", "landing")}
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate("/auth/signup")}
            className="text-lg bg-white text-primary-600 hover:bg-gray-100"
          >
            {t("ctaButton", "landing")}
          </Button>
        </div>
      </section>

      <footer className="container mx-auto px-4 py-12">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p>© 2024 Fluorgan. {t("allRightsReserved", "common")}</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;