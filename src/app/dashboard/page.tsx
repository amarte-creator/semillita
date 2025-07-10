"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import MissionList from "@/components/MissionList";

interface UserTree {
  id: string;
  tree_id: string;
  stage: number;
  planted_at: string;
  last_action_date: string | null;
  tree: {
    name: string;
    image_url: string;
  };
}

const STAGE_IMAGES = [
  "/trees/stage1.png",
  "/trees/stage2.png",
  "/trees/stage3.png",
  "/trees/stage4.png",
];

export default function DashboardPage() {
  const [userTrees, setUserTrees] = useState<UserTree[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.replace("/signup");
        return;
      }
      // Obtener árboles del usuario y datos del árbol
      const { data: trees, error } = await supabase
        .from("user_trees")
        .select("id, tree_id, stage, planted_at, last_action_date, tree:tree_id(name, image_url)")
        .eq("user_id", data.user.id);
      if (error) setError("No se pudieron cargar tus árboles");
      else setUserTrees(trees || []);
      setLoading(false);
    });
  }, [router]);

  const handleAction = async (userTreeId: string, action: string) => {
    // Aquí puedes agregar lógica para actualizar el stage o last_action_date
    setLoading(true);
    const { error } = await supabase
      .from("user_trees")
      .update({ last_action_date: new Date().toISOString() })
      .eq("id", userTreeId);
    if (error) setError("No se pudo actualizar el árbol");
    // Refrescar datos
    const { data: user } = await supabase.auth.getUser();
    const { data: trees } = await supabase
      .from("user_trees")
      .select("id, tree_id, stage, planted_at, last_action_date, tree:tree_id(name, image_url)")
      .eq("user_id", user?.user?.id);
    setUserTrees(trees || []);
    setLoading(false);
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;

  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-b from-blue-100 to-green-50 font-sans py-10">
      <h1 className="text-3xl font-bold text-green-800 mb-6">Tu jardín</h1>
      {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
      {userTrees.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-lg p-8 max-w-md text-center">
          <p className="text-green-700 mb-4">¡Aún no has plantado ningún árbol!</p>
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow transition-all"
            onClick={() => router.push("/onboarding/choose-tree")}
          >
            Plantar mi primer árbol
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-8 justify-center">
          {userTrees.map((ut) => (
            <div key={ut.id} className="bg-white rounded-3xl shadow-md p-6 flex flex-col items-center w-64">
              <img
                src={ut.tree.image_url || STAGE_IMAGES[ut.stage - 1]}
                alt={ut.tree.name}
                className="w-24 h-24 object-contain mb-2"
              />
              <h2 className="text-xl font-bold text-green-800 mb-1">{ut.tree.name}</h2>
              <p className="text-green-600 text-sm mb-2">Etapa: {ut.stage}</p>
              <div className="flex gap-3 mb-2">
                <button
                  className="bg-blue-200 hover:bg-blue-300 text-blue-900 font-bold py-2 px-4 rounded-full"
                  onClick={() => handleAction(ut.id, "regar")}
                >
                  Regar
                </button>
                <button
                  className="bg-yellow-200 hover:bg-yellow-300 text-yellow-900 font-bold py-2 px-4 rounded-full"
                  onClick={() => handleAction(ut.id, "cuidar")}
                >
                  Cuidar
                </button>
                <button
                  className="bg-green-200 hover:bg-green-300 text-green-900 font-bold py-2 px-4 rounded-full"
                  onClick={() => handleAction(ut.id, "medir")}
                >
                  Medir
                </button>
              </div>
              <p className="text-xs text-gray-400">Última acción: {ut.last_action_date ? new Date(ut.last_action_date).toLocaleDateString() : "Nunca"}</p>
            </div>
          ))}
        </div>
      )}
      {/* Misiones diarias */}
      <MissionList />
    </main>
  );
} 