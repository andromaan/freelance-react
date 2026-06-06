import React, { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useSignInMutation } from "../../services/auth/authApi";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { userApi } from "../../services/user/userApi";
import type { AppDispatch } from "../../store";
import type { SignInVM, FormErrors } from "../../types/auth.types";
import GoogleLogin from "./GoogleLogin";
import ArrowIcon from "../../components/icons/ArrowIcon";
import PasswordEyeIcon from "../../components/icons/PasswordEyeIcon";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const [signIn, { isLoading }] = useSignInMutation();

  const [formValues, setFormValues] = useState<SignInVM>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
    // Очищаємо помилку при зміні значення
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formValues.email) {
      newErrors.email = t("auth.requiredField");
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      newErrors.email = t("auth.invalidEmail");
    }

    if (!formValues.password) {
      newErrors.password = t("auth.requiredField");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      await signIn(formValues).unwrap();
      dispatch(
        userApi.endpoints.getMyself.initiate(undefined, { forceRefetch: true }),
      );
      navigate("/");
    } catch (error: any) {
      const errorMessage =
        error?.message || error?.data?.message || t("auth.loginError");
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-5 relative">
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
      >
        <ArrowIcon direction="left" />
        <span className="font-medium text-sm hidden sm:inline">
          {t("auth.backHome")}
        </span>
      </Link>

      <div className="bg-surface border border-border rounded-xl p-8 w-full max-w-md shadow-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <h1 className="text-text-main text-2xl font-semibold mb-6 text-center">
            {t("auth.loginTitle")}
          </h1>

          <div className="w-full">
            <label
              htmlFor="email"
              className="text-gray-700 dark:text-gray-300 text-sm font-medium mb-2 block"
            >
              {t("auth.emailLabel")}
            </label>
            <input
              id="email"
              type="email"
              name="email"
              onChange={handleChange}
              value={formValues.email}
              className={`w-full px-3 py-3 border-2 rounded-lg bg-white dark:bg-gray-700 text-text-main text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed ${
                errors.email
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200 dark:border-gray-600 focus:border-primary"
              }`}
              placeholder={t("auth.emailPlaceholder")}
              disabled={isLoading}
            />
            {errors.email && (
              <div className="text-red-500 text-xs mt-1">{errors.email}</div>
            )}
          </div>

          <div className="w-full">
            <label
              htmlFor="password"
              className="text-gray-700 dark:text-gray-300 text-sm font-medium mb-2 block"
            >
              {t("auth.passwordLabel")}
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                onChange={handleChange}
                value={formValues.password}
                className={`w-full px-3 py-3 pr-10 border-2 rounded-lg bg-white dark:bg-gray-700 text-text-main text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed ${
                  errors.password
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 dark:border-gray-600 focus:border-primary"
                }`}
                placeholder={t("auth.passwordPlaceholder")}
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                <PasswordEyeIcon isClosed={!showPassword} className="w-5 h-5" />
              </button>
            </div>
            {errors.password && (
              <div className="text-red-500 text-xs mt-1">{errors.password}</div>
            )}
          </div>

          <button
            type="submit"
            className="bg-primary hover:bg-primary-hover text-white border-none rounded-lg px-3 py-3 text-base font-medium cursor-pointer transition-all w-full disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? t("auth.loading") : t("auth.signInBtn")}
          </button>

          <div className="text-center mt-4">
            <Link
              to="/register"
              className="text-primary hover:text-primary-hover text-sm transition-colors hover:underline"
            >
              {t("auth.noAccount")}
            </Link>
          </div>
        </form>

        <div className="mt-6 text-center">
          <div className="flex items-center my-5 text-text-muted">
            <div className="flex-1 border-b border-gray-200 dark:border-gray-600"></div>
            <span className="px-3 text-sm">{t("auth.or")}</span>
            <div className="flex-1 border-b border-gray-200 dark:border-gray-600"></div>
          </div>
          <GoogleLogin />
        </div>
      </div>
    </div>
  );
};

export default Login;
