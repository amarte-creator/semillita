"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

interface Tree {
  id: string;
  name: string;
  info: string;
  image_url: string;
}

export default function ChooseTreePage() {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.replace("/signup");
    });
    supabase.from("trees").select("*").then(({ data, error }) => {
      if (data) setTrees(data);
    });
  }, [router]);

  const handlePlant = async () => {
    if (!selected) return;
    setLoading(true);
    setError("");
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setError("Debes estar logueado");
      setLoading(false);
      return;
    }
    const { error: dbError } = await supabase.from("user_trees").insert({
      user_id: userData.user.id,
      tree_id: selected,
      stage: 1,
    });
    if (dbError) {
      setError("No se pudo plantar el árbol. Intenta de nuevo.");
      setLoading(false);
      return;
    }
    router.replace("/dashboard");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-green-50 font-sans">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-lg flex flex-col items-center">
        <h1 className="text-2xl font-bold text-green-800 mb-4">Elige un árbol para plantar</h1>
        <div className="flex flex-wrap gap-6 justify-center mb-6">
          {trees.map(tree => (
            <button
              key={tree.id}
              type="button"
              className={`flex flex-col items-center p-4 rounded-2xl border-4 transition-all shadow-md w-36 h-48 ${selected === tree.id ? "border-green-500 bg-green-50" : "border-transparent bg-white"}`}
              onClick={() => setSelected(tree.id)}
            >
              <img src={tree.image_url} alt={tree.name} className="w-20 h-20 object-contain mb-2" />
              <span className="font-bold text-green-800 text-lg">{tree.name}</span>
              <span className="text-green-600 text-xs text-center mt-1">{tree.info}</span>
            </button>
          ))}
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <button
          onClick={handlePlant}
          disabled={!selected || loading}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow mt-2 transition-all disabled:opacity-50"
        >
          {loading ? "Plantando..." : "Plantar árbol"}
        </button>
      </div>
    </main>
  );
} 