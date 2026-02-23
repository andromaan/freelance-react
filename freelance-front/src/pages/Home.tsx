import React from "react";
import { Link } from "react-router-dom";
import { tokenStorage } from "../services/auth/tokenStorage";

const stats = [
  { value: "10,000+", label: "Фрілансерів" },
  { value: "5,000+", label: "Завершених проектів" },
  { value: "2,000+", label: "Роботодавців" },
  { value: "98%", label: "Задоволених клієнтів" },
];

const categories = [
  {
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
    ),
    title: "Розробка",
    description: "Веб, мобільні додатки, API",
    count: "1,200+ фрілансерів",
  },
  {
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    title: "Дизайн",
    description: "UI/UX, графіка, брендинг",
    count: "850+ фрілансерів",
  },
  {
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
    ),
    title: "Контент",
    description: "Тексти, копірайтинг, переклади",
    count: "640+ фрілансерів",
  },
  {
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    title: "Маркетинг",
    description: "SMM, SEO, реклама",
    count: "500+ фрілансерів",
  },
  {
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    ),
    title: "Відео",
    description: "Монтаж, анімація, motion",
    count: "380+ фрілансерів",
  },
  {
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    ),
    title: "Консалтинг",
    description: "Бізнес-аналіз, фінанси",
    count: "290+ фрілансерів",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Зареєструйтесь",
    description: "Створіть акаунт фрілансера або роботодавця за кілька хвилин.",
  },
  {
    step: "02",
    title: "Знайдіть роботу або виконавця",
    description:
      "Переглядайте вакансії або профілі фрілансерів та оберіть найкращого.",
  },
  {
    step: "03",
    title: "Домовтеся і починайте",
    description: "Узгодьте умови, підпишіть угоду та розпочніть проект.",
  },
  {
    step: "04",
    title: "Отримайте результат",
    description:
      "Виконавець здає роботу, ви підтверджуєте і оплачуєте через платформу.",
  },
];

const Home: React.FC = () => {
  const isAuthenticated = tokenStorage.isAuthenticated();

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 dark:from-gray-900 dark:via-blue-950 dark:to-gray-950 text-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Знайдіть ідеального{" "}
            <span className="text-blue-200">фрілансера</span>
            <br />
            для вашого проекту
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Тисячі перевірених фахівців готові допомогти вашому бізнесу рости.
            Швидко, безпечно, якісно.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <>
                <Link
                  to="/jobs"
                  className="bg-white text-blue-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors text-base"
                >
                  Знайти роботу
                </Link>
                <Link
                  to="/freelancers"
                  className="bg-blue-500/30 border border-white/30 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-500/50 transition-colors text-base"
                >
                  Знайти фрілансера
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-white text-blue-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors text-base"
                >
                  Розпочати безкоштовно
                </Link>
                <Link
                  to="/login"
                  className="bg-blue-500/30 border border-white/30 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-500/50 transition-colors text-base"
                >
                  Увійти
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Популярні категорії
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Знайдіть фахівця у будь-якій сфері
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat) => (
              <Link
                to="/freelancers"
                key={cat.title}
                className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 flex items-start gap-4 hover:border-primary hover:shadow-md transition-all"
              >
                <div className="text-primary bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                    {cat.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {cat.description}
                  </p>
                  <span className="text-xs text-primary font-medium">
                    {cat.count}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Як це працює
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Почніть працювати або шукати виконавців за 4 простих кроки
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item) => (
              <div key={item.step}>
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!isAuthenticated && (
        <section className="py-16 bg-primary dark:bg-blue-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Готові розпочати?
            </h2>
            <p className="text-blue-100 mb-8 text-base sm:text-lg max-w-xl mx-auto">
              Приєднуйтесь до тисяч фрілансерів та роботодавців, які вже знайшли
              один одного.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-primary hover:bg-blue-50 font-semibold px-8 py-3.5 rounded-xl transition-colors text-base"
              >
                Зареєструватись як фрілансер
              </Link>
              <Link
                to="/register"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-3.5 rounded-xl transition-colors text-base"
              >
                Знайти виконавця
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Home;
