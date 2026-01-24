import React, { useEffect, useRef, useState } from "react";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

/**
 * Renders the official "Sign in with Google" or "Sign up with Google" button.
 * Requires VITE_GOOGLE_CLIENT_ID in .env and the GSI script in index.html.
 */
export default function GoogleSignInButton({ mode = "signin", onCredential, disabled }) {
  const containerRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      setErrored(true);
      return;
    }
    const check = () => {
      if (window.google?.accounts?.id) {
        setReady(true);
        return true;
      }
      return false;
    };
    if (check()) return;
    const id = setInterval(() => {
      if (check()) clearInterval(id);
    }, 80);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!ready || !containerRef.current || !GOOGLE_CLIENT_ID) return;
    try {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (res) => {
          if (res?.credential && onCredential) onCredential(res.credential);
        },
      });
      window.google.accounts.id.renderButton(containerRef.current, {
        type: "standard",
        theme: "filled_black",
        size: "large",
        text: mode === "signup" ? "signup_with" : "signin_with",
        shape: "rectangular",
        width: 320,
      });
    } catch (e) {
      console.error("Google button render error:", e);
      setErrored(true);
    }
    return () => {
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [ready, mode, onCredential]);

  if (errored || !GOOGLE_CLIENT_ID) return null;
  return (
    <div className="flex justify-center">
      <div
        ref={containerRef}
        className={disabled ? "opacity-50 pointer-events-none" : ""}
        style={{ minHeight: 44 }}
      />
    </div>
  );
}
