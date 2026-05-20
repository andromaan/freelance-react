import React, { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useSignUpMutation } from "../../services/auth/authApi";
import { useDispatch } from "react-redux";
import { userApi } from "../../services/user/userApi";
import type { AppDispatch } from "../../store";
import type { SignUpVM, FormErrors, UserRole } from "../../types/auth.types";
import { UserRoles } from "../../types/auth.types";
import GoogleLogin from "./GoogleLogin";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [signUp, { isLoading }] = useSignUpMutation();

  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    displayName: "",
    userRole: UserRoles.FREELANCER as UserRole,
  });

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

    try {
      const signUpData: SignUpVM = {
        email: formValues.email,
        password: formValues.password,
        displayName: formValues.displayName || undefined,
        userRole: formValues.userRole,
      };

      await signUp(signUpData).unwrap();
      dispatch(
        userApi.endpoints.getMyself.initiate(undefined, { forceRefetch: true }),
      );
      toast.success("Успішна реєстрація!");
      navigate("/");
    } catch (error: any) {
      const errorMessage =
        error?.message || error?.data?.message || "Помилка реєстрації";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-5">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 w-full max-w-md shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-gray-900 dark:text-white text-2xl font-semibold mb-2">
            Register
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Create your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="w-full">
            <label
              htmlFor="displayName"
              className="text-gray-700 dark:text-gray-300 text-sm font-medium mb-2 block"
            >
              Name
            </label>
            <input
              id="displayName"
              type="text"
              name="displayName"
              onChange={handleChange}
              value={formValues.displayName}
              className={`w-full px-3 py-3 border-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed ${
                errors.displayName
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200 dark:border-gray-600 focus:border-primary"
              }`}
              placeholder="Enter name"
              disabled={isLoading}
            />
            {errors.displayName && (
              <div className="text-red-500 text-xs mt-1">
                {errors.displayName}
              </div>
            )}
          </div>

          <div className="w-full">
            <label
              htmlFor="email"
              className="text-gray-700 dark:text-gray-300 text-sm font-medium mb-2 block"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              onChange={handleChange}
              value={formValues.email}
              className={`w-full px-3 py-3 border-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed ${
                errors.email
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200 dark:border-gray-600 focus:border-primary"
              }`}
              placeholder="Enter email"
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
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              onChange={handleChange}
              value={formValues.password}
              className={`w-full px-3 py-3 border-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed ${
                errors.password
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200 dark:border-gray-600 focus:border-primary"
              }`}
              placeholder="Enter password (minimum 8 characters)"
              disabled={isLoading}
            />
            {errors.password && (
              <div className="text-red-500 text-xs mt-1">{errors.password}</div>
            )}
          </div>

          <div className="w-full">
            <label className="text-gray-700 dark:text-gray-300 text-sm font-medium mb-2 block">
              Select Role
            </label>
            <div className="flex flex-col gap-3 mt-2">
              <label className="flex items-center px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer transition-all hover:border-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 bg-white dark:bg-gray-700">
                <input
                  type="radio"
                  name="userRole"
                  value={UserRoles.FREELANCER}
                  checked={formValues.userRole === UserRoles.FREELANCER}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-4 h-4 mr-3 cursor-pointer accent-primary"
                />
                <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                  Freelancer
                </span>
              </label>
              <label className="flex items-center px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer transition-all hover:border-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 bg-white dark:bg-gray-700">
                <input
                  type="radio"
                  name="userRole"
                  value={UserRoles.EMPLOYER}
                  checked={formValues.userRole === UserRoles.EMPLOYER}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-4 h-4 mr-3 cursor-pointer accent-primary"
                />
                <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                  Employer
                </span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="bg-primary hover:bg-primary-hover text-white border-none rounded-lg px-3 py-3 text-base font-medium cursor-pointer transition-all w-full disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Register"}
          </button>

          <div className="text-center mt-4">
            <Link
              to="/login"
              className="text-primary hover:text-primary-hover text-sm transition-colors hover:underline"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>

        <div className="mt-6 text-center">
          <div className="flex items-center my-5 text-gray-600 dark:text-gray-400">
            <div className="flex-1 border-b border-gray-200 dark:border-gray-600"></div>
            <span className="px-3 text-sm">or</span>
            <div className="flex-1 border-b border-gray-200 dark:border-gray-600"></div>
          </div>
          <GoogleLogin />
        </div>
      </div>
    </div>
  );
};

export default Register;
