import { useState } from "react";
import { useLogin } from "../hooks/mutations/useLogin";

export default function Login() {

  const [form, setForm] = useState({
    username: "",
    password: "",
    remember: false
  });

  const loginMutation = useLogin();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    loginMutation.mutate({
      username: form.username,
      password: form.password
    });
  };


  
  return (
    <div className="bg-white w-[340px] rounded-sm shadow-2xl p-7">

      <h3 className="text-xl font-semibold text-gray-500 mb-5">
        Welcome
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="username"
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
          className="w-full py-2.5 text-sm border-b border-gray-300 focus:outline-none focus:border-[#005eb8] transition-colors bg-transparent"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full py-2.5 text-sm border-b border-gray-300 focus:outline-none focus:border-[#005eb8] transition-colors bg-transparent"
        />

        <div className="flex justify-between items-center text-xs text-gray-600 pt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              name="remember"
              type="checkbox"
              checked={form.remember}
              onChange={handleChange}
              className="accent-[#005eb8]"
            />
            Remember me
          </label>

          <button
            type="button"
            className="text-[#005eb8] hover:underline"
          >
            Use token
          </button>
        </div>

        {loginMutation.isError && (
          <p className="text-red-600 text-xs">
            {loginMutation.error?.message || "Login failed"}
          </p>
        )}

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full bg-[#005eb8] hover:bg-[#004a94] disabled:bg-gray-400 text-white py-2.5 rounded-sm font-semibold text-sm transition-colors"
        >
          {loginMutation.isPending ? "Signing in..." : "Sign in"}
        </button>

      </form>

      <div className="mt-4 space-y-1.5 text-xs">
        <button className="block text-[#005eb8] hover:underline">
          Forgot username/password?
        </button>

        <button className="block text-[#005eb8] hover:underline">
          Not enrolled? Sign up now
        </button>
      </div>

    </div>
  );
}