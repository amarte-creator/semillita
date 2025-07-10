"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const AVATARS = [
  "/avatars/avatar1.png",
  "/avatars/avatar2.png",
  "/avatars/avatar3.png",
  "/avatars/avatar4.png",
];

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const router = useRouter();

  // Si ya está logueado, redirigir a dashboard
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        // Verificar si ya existe en users
        const { data: userRow } = await supabase
          .from("users")
          .select("id")
          .eq("id", data.user.id)
          .single();
        if (!userRow) {
          // Guardar nickname y avatar si es nuevo
          await supabase.from("users").insert({
            id: data.user.id,
            nickname,
            avatar,
            eco_points: 0,
          });
        }
        router.replace("/dashboard");
      }
    });
    // eslint-disable-next-line
  }, [router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSent(false);
    // Enviar magic link
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      setError("No se pudo enviar el enlace. Intenta de nuevo.");
      setLoading(false);
      return;
    }
    setSent(true);
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-green-50 font-sans">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
        <h1 className="text-2xl font-bold text-green-800 mb-4">Crea tu cuenta</h1>
        {sent ? (
          <div className="text-center text-green-700">
            <p>¡Revisa tu correo!</p>
            <p>Te enviamos un enlace para ingresar a Semillita.</p>
          </div>
        ) : (
          <form className="w-full flex flex-col gap-4" onSubmit={handleSignup}>
            <label className="font-semibold text-green-700">Tu correo</label>
            <input
              type="email"
              required
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="ejemplo@email.com"
            />
            <label className="font-semibold text-green-700">Tu apodo</label>
            <input
              type="text"
              required
              minLength={2}
              maxLength={16}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              placeholder="Escribe tu apodo"
            />
            <label className="font-semibold text-green-700 mt-2">Elige tu avatar</label>
            <div className="flex gap-4 justify-center mb-2">
              {AVATARS.map((src) => (
                <button
                  type="button"
                  key={src}
                  className={`rounded-full border-4 ${avatar === src ? "border-green-500" : "border-transparent"} focus:outline-none`}
                  onClick={() => setAvatar(src)}
                >
                  <img src={src} alt="avatar" className="w-16 h-16 rounded-full bg-green-100" />
                </button>
              ))}
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow mt-2 transition-all disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Registrarse"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
} 