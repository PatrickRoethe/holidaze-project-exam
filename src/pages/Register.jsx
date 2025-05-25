import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/base/Button";
import ErrorMessage from "../components/base/ErrorMessage";
import Input from "../components/base/Input";
import Loader from "../components/base/Loader";
import useAuthStore from "../store/authStore";

export default function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [loading, setLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const password = watch("password");

  async function onSubmit(data) {
    setLoading(true);
    setRegisterError("");

    const isVenueManager =
      data.venueManager === true ||
      data.venueManager === "true" ||
      data.venueManager === 1;

    const payload = {
      name: data.username,
      email: data.email,
      password: data.password,
      venueManager: isVenueManager,
    };

    try {
      // 1. Registrer bruker
      const registerRes = await axios.post(
        "https://v2.api.noroff.dev/auth/register",
        payload
      );

      if (registerRes.status !== 201) {
        throw new Error("Registration failed");
      }

      // 2. Logg inn etter registrering
      const loginRes = await axios.post(
        "https://v2.api.noroff.dev/auth/login",
        {
          email: data.email,
          password: data.password,
        }
      );

      const { accessToken, ...userRaw } = loginRes.data.data;
      const user = {
        ...userRaw,
        venueManager: userRaw.venueManager === true,
      };

      // 3. Hent API-nøkkel
      const keyRes = await axios.post(
        "https://v2.api.noroff.dev/auth/create-api-key",
        { name: "Holidaze App Key" }, // <- 🔧 FIX HER
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const apiKey = keyRes.data.data.key;

      // 4. Lagre i Zustand + sessionStorage
      login({ accessToken, user, apiKey });
      sessionStorage.setItem("accessToken", accessToken);
      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("apiKey", apiKey);
      useAuthStore.getState().initAuth();

      navigate("/profile");
    } catch (error) {
      console.error("[REGISTER] Error:", error?.response || error);
      const message = error?.response?.data?.errors?.[0]?.message;
      setRegisterError(message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-light rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Register</h1>

      {registerError && <ErrorMessage message={registerError} />}
      {loading && <Loader />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="your@stud.noroff.no"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[\w.-]+@stud\.noroff\.no$/,
              message: "Email must end with @stud.noroff.no",
            },
          })}
          error={errors.email?.message}
        />

        <Input
          label="Username"
          name="username"
          placeholder="Choose a username"
          {...register("username", {
            required: "Username is required",
          })}
          error={errors.username?.message}
        />

        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Create a password"
          autoComplete="new-password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters long",
            },
          })}
          error={errors.password?.message}
        />

        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="Repeat your password"
          autoComplete="new-password"
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) => value === password || "Passwords do not match",
          })}
          error={errors.confirmPassword?.message}
        />

        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            {...register("venueManager")}
            className="border-gray-300"
          />
          <span>Register as Venue Manager</span>
        </label>

        <Button type="submit" disabled={loading}>
          Register
        </Button>
      </form>

      <p className="mt-4 text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-primary underline">
          Logg inn
        </Link>
      </p>
    </div>
  );
}
