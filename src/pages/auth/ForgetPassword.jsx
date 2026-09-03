
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  ArrowLeft,
  CheckCircle,
  KeyRound,
} from "lucide-react";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    const savedUsers = JSON.parse(
      localStorage.getItem("users") || "[]"
    );

    const userExists = savedUsers.some(
      (user) =>
        user.email?.toLowerCase() ===
        email.trim().toLowerCase()
    );

    if (!userExists) {
      setError(
        "No account was found with this email address."
      );
      return;
    }

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md">

        {/* CARD */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">

          {!submitted ? (
            <>
              {/* ICON */}

              <div className="w-14 h-14 mx-auto bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                <KeyRound size={28} />
              </div>

              {/* TITLE */}

              <div className="text-center mt-5">

                <h1 className="text-2xl font-bold text-gray-900">
                  Forgot Password?
                </h1>

                <p className="text-gray-500 mt-2 text-sm">
                  Enter your email address and we'll help
                  you reset your password.
                </p>

              </div>

              {/* ERROR */}

              {error && (
                <div className="mt-5 bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-sm">
                  {error}
                </div>
              )}

              {/* FORM */}

              <form
                onSubmit={handleSubmit}
                className="mt-6 space-y-5"
              >

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>

                  <div className="relative">

                    <Mail
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />

                  </div>

                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
                >
                  Reset Password
                </button>

              </form>

              {/* BACK LOGIN */}

              <Link
                to="/login"
                className="mt-6 inline-flex items-center justify-center gap-2 w-full text-sm text-gray-600 hover:text-blue-600 transition"
              >
                <ArrowLeft size={16} />
                Back to Login
              </Link>
            </>
          ) : (
            <>
              {/* SUCCESS */}

              <div className="w-14 h-14 mx-auto bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
                <CheckCircle size={28} />
              </div>

              <div className="text-center mt-5">

                <h1 className="text-2xl font-bold text-gray-900">
                  Request Received
                </h1>

                <p className="text-gray-500 mt-3 text-sm leading-6">
                  Your password reset request has been
                  received successfully.
                </p>

                <p className="text-gray-500 mt-2 text-sm">
                  Password reset through email will be
                  connected to the server tomorrow.
                </p>

              </div>

              <Link
                to="/login"
                className="mt-7 w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
              >
                <ArrowLeft size={17} />
                Back to Login
              </Link>

            </>
          )}

        </div>

      </div>

    </div>
  );
}

export default ForgetPassword;

