"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [signIn, setSignIn] = useState({ email: "", password: "" });
  const [signUp, setSignUp] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (activeTab === "signin") {
      if (!signIn.email.trim()) e.email = "Required";
      if (!signIn.password.trim()) e.password = "Required";
    } else {
      if (!signUp.name.trim()) e.name = "Required";
      if (!signUp.email.trim()) e.email = "Required";
      if (!signUp.password.trim()) e.password = "Required";
      if (signUp.password !== signUp.confirm) e.confirm = "Passwords do not match";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="page">
      <section
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(6rem, 12vw, 10rem) var(--gutter) 4rem",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "440px",
          }}
        >
          {submitted ? (
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "var(--accent)",
                  color: "var(--light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem",
                  fontSize: "1.5rem",
                }}
              >
                ✓
              </div>
              <h2 className="heading-h3" style={{ marginBottom: "0.75rem" }}>
                {activeTab === "signin" ? "Welcome back." : "Welcome to NOIRÉ."}
              </h2>
              <p style={{ color: "var(--muted)", marginBottom: "2rem" }}>
                {activeTab === "signin"
                  ? "You have been signed in (demo)."
                  : "Your account has been created (demo)."}
              </p>
              <Link href="/" className="btn btn--ghost">
                Return Home
              </Link>
            </div>
          ) : (
            <>
              <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                <p className="eyebrow" style={{ marginBottom: "1rem" }}>ACCOUNT</p>
                <h1 className="heading-h2">
                  {activeTab === "signin" ? "Sign In" : "Create Account"}
                </h1>
              </div>

              {/* Tabs */}
              <div className="tabs" role="tablist" style={{ justifyContent: "center", marginBottom: "2.5rem" }}>
                <button
                  role="tab"
                  aria-selected={activeTab === "signin"}
                  className={`tab ${activeTab === "signin" ? "active" : ""}`}
                  onClick={() => { setActiveTab("signin"); setErrors({}); }}
                >
                  Sign In
                </button>
                <button
                  role="tab"
                  aria-selected={activeTab === "signup"}
                  className={`tab ${activeTab === "signup" ? "active" : ""}`}
                  onClick={() => { setActiveTab("signup"); setErrors({}); }}
                >
                  Create Account
                </button>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  {activeTab === "signup" && (
                    <div className="form-group">
                      <label className="form-label" htmlFor="login-name">
                        Name <span className="required">*</span>
                      </label>
                      <input
                        id="login-name"
                        type="text"
                        className="form-input"
                        value={signUp.name}
                        onChange={(e) => setSignUp((p) => ({ ...p, name: e.target.value }))}
                      />
                      {errors.name && <span className="form-error">{errors.name}</span>}
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label" htmlFor="login-email">
                      Email <span className="required">*</span>
                    </label>
                    <input
                      id="login-email"
                      type="email"
                      className="form-input"
                      value={activeTab === "signin" ? signIn.email : signUp.email}
                      onChange={(e) =>
                        activeTab === "signin"
                          ? setSignIn((p) => ({ ...p, email: e.target.value }))
                          : setSignUp((p) => ({ ...p, email: e.target.value }))
                      }
                    />
                    {errors.email && <span className="form-error">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="login-password">
                      Password <span className="required">*</span>
                    </label>
                    <input
                      id="login-password"
                      type="password"
                      className="form-input"
                      value={activeTab === "signin" ? signIn.password : signUp.password}
                      onChange={(e) =>
                        activeTab === "signin"
                          ? setSignIn((p) => ({ ...p, password: e.target.value }))
                          : setSignUp((p) => ({ ...p, password: e.target.value }))
                      }
                    />
                    {errors.password && <span className="form-error">{errors.password}</span>}
                  </div>

                  {activeTab === "signup" && (
                    <div className="form-group">
                      <label className="form-label" htmlFor="login-confirm">
                        Confirm Password <span className="required">*</span>
                      </label>
                      <input
                        id="login-confirm"
                        type="password"
                        className="form-input"
                        value={signUp.confirm}
                        onChange={(e) => setSignUp((p) => ({ ...p, confirm: e.target.value }))}
                      />
                      {errors.confirm && <span className="form-error">{errors.confirm}</span>}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn--primary btn--lg"
                    disabled={loading}
                    style={{ width: "100%", marginTop: "0.5rem" }}
                  >
                    {loading
                      ? "Please wait..."
                      : activeTab === "signin"
                        ? "Sign In"
                        : "Create Account"}
                  </button>
                </div>
              </form>

              <p
                style={{
                  fontSize: "var(--micro)",
                  color: "var(--muted)",
                  textAlign: "center",
                  marginTop: "1.5rem",
                  padding: "0.75rem",
                  background: "var(--surface)",
                }}
              >
                No real authentication is implemented. This is a UI demo.
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
