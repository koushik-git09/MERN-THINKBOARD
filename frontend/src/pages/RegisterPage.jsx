import { useState } from "react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register({ username, password });
      navigate("/");
    } catch (error) {
      const msg = error?.response?.data?.message || "Registration failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card bg-base-100 w-full max-w-md">
        <div className="card-body">
          <h2 className="card-title text-2xl">Register</h2>

          <form onSubmit={handleSubmit} className="mt-2">
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                className="input input-bordered"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="yourname"
                autoComplete="username"
              />
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                className="input input-bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="at least 6 characters"
                autoComplete="new-password"
              />
            </div>

            <button className="btn btn-primary w-full" disabled={loading}>
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>

          <p className="text-sm text-base-content/70 mt-4">
            Already have an account?{" "}
            <Link className="link link-primary" to="/login">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
