import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/base/Button";
import ErrorMessage from "../components/base/ErrorMessage";
import Input from "../components/base/Input";
import Loader from "../components/base/Loader";
import useAuthStore from "../store/authStore";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  async function onSubmit(data) {
    setLoading(true);
    setLoginError("");

    try {
      const response = await axios.post(
        "https://v2.api.noroff.dev/auth/login?_holidaze=true",
        {
          email: data.email,
          password: data.password,
        }
      );

      const { accessToken, ...user } = response.data.data;

      login({ accessToken, user });
      sessionStorage.setItem("accessToken", accessToken);
      sessionStorage.setItem("user", JSON.stringify(user));
      useAuthStore.getState().initAuth();

      navigate("/profile");
    } catch (error) {
      console.error("[LOGIN ERROR]", error?.response?.data);
      const message = error?.response?.data?.errors?.[0]?.message;
      setLoginError(message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-light rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      {loading && !loginError && (
        <p className="text-sm text-gray-600 mb-2">Logging in, please wait...</p>
      )}

      {loginError && <ErrorMessage message={loginError} />}
      {loading && <Loader />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="your@email.com"
          {...register("email", {
            required: "Email is required",
          })}
          error={errors.email?.message}
        />

        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Your password"
          {...register("password", {
            required: "Password is required",
          })}
          error={errors.password?.message}
        />

        <Button type="submit" disabled={loading}>
          Logg inn
        </Button>
      </form>

      <p className="mt-4 text-sm">
        Don’t have an account?{" "}
        <Link to="/register" className="text-primary underline">
          Register here
        </Link>
      </p>
    </div>
  );
}
