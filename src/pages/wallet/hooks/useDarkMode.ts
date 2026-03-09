import { useState, useEffect } from "react";

/** Визначає чи активна темна тема (клас 'dark' на <html> або prefers-color-scheme) */
export function useDarkMode(): boolean {
  const isDark = () =>
    document.documentElement.classList.contains("dark") ||
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const [dark, setDark] = useState(isDark);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onMqChange = () => setDark(isDark());
    mq.addEventListener("change", onMqChange);

    // Спостерігаємо за зміною класу на <html> (Tailwind dark mode)
    const observer = new MutationObserver(() => setDark(isDark()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      mq.removeEventListener("change", onMqChange);
      observer.disconnect();
    };
  }, []);

  return dark;
}
