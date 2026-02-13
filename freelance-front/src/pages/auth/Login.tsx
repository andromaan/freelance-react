import React, { useState, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { authService } from "../../services/auth.service";
import type { SignInVM, FormErrors } from "../../types/auth.types";
import GoogleLogin from "./GoogleLogin";
import "./auth.css";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState<SignInVM>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

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
      newErrors.email = "Обов'язкове поле";
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      newErrors.email = "Некоректний email";
    }

    if (!formValues.password) {
      newErrors.password = "Обов'язкове поле";
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
      const response = await authService.signIn(formValues);

      if (!response.success) {
        toast.error(response.message || "Помилка входу");
      } else {
        toast.success("Успішний вхід!");
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
        <form onSubmit={handleSubmit} className="auth-form">
          <h1>Вхід</h1>

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
              placeholder="Введіть пароль"
              disabled={isLoading}
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
          </div>

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? "Завантаження..." : "Увійти"}
          </button>

          <div className="auth-link">
            <Link to="/register">Ще не маєте акаунта? Зареєструватися</Link>
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

export default Login;
