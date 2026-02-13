import React, { useState, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { authService } from "../../services/auth.service";
import type { SignUpVM, FormErrors } from "../../types/auth.types";
import GoogleLogin from "./GoogleLogin";
import "./auth.css";

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    displayName: "",
    isFreelancer: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormValues({
      ...formValues,
      [name]: type === "checkbox" ? checked : value,
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

    if (!formValues.displayName) {
      newErrors.displayName = "Обов'язкове поле";
    }

    if (!formValues.email) {
      newErrors.email = "Обов'язкове поле";
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      newErrors.email = "Некоректний email";
    }

    if (!formValues.password || formValues.password.length < 8) {
      newErrors.password = "Повинно бути 8 і більше символів";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    try {
      const signUpData: SignUpVM = {
        email: formValues.email,
        password: formValues.password,
        displayName: formValues.displayName || undefined,
        isFreelancer: formValues.isFreelancer,
      };

      const response = await authService.signUp(signUpData);

      if (!response.success) {
        toast.error(response.message || "Помилка реєстрації");
      } else {
        toast.success("Успішна реєстрація!");
        navigate("/");
      }
    } catch (error) {
      toast.error("Помилка з'єднання з сервером");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <h1>Реєстрація</h1>
          <p>Створіть свій акаунт</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="displayName">Ім'я</label>
            <input
              id="displayName"
              type="text"
              name="displayName"
              onChange={handleChange}
              value={formValues.displayName}
              className={`form-control ${errors.displayName ? "is-invalid" : ""}`}
              placeholder="Введіть ім'я"
              disabled={isLoading}
            />
            {errors.displayName && (
              <div className="invalid-feedback">{errors.displayName}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              onChange={handleChange}
              value={formValues.email}
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              placeholder="Введіть email"
              disabled={isLoading}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              type="password"
              name="password"
              onChange={handleChange}
              value={formValues.password}
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              placeholder="Введіть пароль (мінімум 8 символів)"
              disabled={isLoading}
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isFreelancer"
                checked={formValues.isFreelancer}
                onChange={handleChange}
                disabled={isLoading}
              />
              <span>Я фрілансер</span>
            </label>
          </div>

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? "Завантаження..." : "Зареєструватися"}
          </button>

          <div className="auth-link">
            <Link to="/login">Вже є акаунт? Увійти</Link>
          </div>
        </form>

        <div className="google-login-container">
          <div className="divider">
            <span>або</span>
          </div>
          <GoogleLogin />
        </div>
      </div>
    </div>
  );
};

export default Register;
