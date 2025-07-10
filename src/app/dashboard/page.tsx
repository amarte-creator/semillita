"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import MissionList from "@/components/MissionList";
import TreeGuide from "@/components/TreeGuide";

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
  const [showGuide, setShowGuide] = useState<{ open: boolean; tree: any } | null>(null);

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
          {userTrees.map((ut) => {
            // Guías educativas por tipo de árbol
            const guides: Record<string, { text: string; emoji: string }[]> = {
              Palta: [
                { text: "Busca una semilla de palta madura. ¿Listo? ¡Siguiente!", emoji: "🥑" },
                { text: "Llena una maceta con tierra fértil y húmeda.", emoji: "🪴" },
                { text: "Haz un pequeño hueco y coloca la semilla con la punta hacia arriba.", emoji: "🌱" },
                { text: "Agrega un poco de agua, ¡pero no demasiada!", emoji: "💧" },
                { text: "Pon la maceta en un lugar con sol y revisa cada día.", emoji: "☀️👀" },
              ],
              Mango: [
                { text: "Consigue una semilla de mango y límpiala bien.", emoji: "🥭" },
                { text: "Plántala en tierra húmeda y fértil.", emoji: "🪴" },
                { text: "Riega suavemente y mantén la tierra húmeda.", emoji: "💧" },
                { text: "Coloca la maceta en un lugar cálido y con sol.", emoji: "☀️" },
                { text: "Observa cómo crece tu mango cada semana.", emoji: "👀" },
              ],
              Limón: [
                { text: "Elige semillas de limón frescas.", emoji: "🍋" },
                { text: "Plántalas en una maceta con tierra húmeda.", emoji: "🪴" },
                { text: "Riega con cuidado y no encharques.", emoji: "💧" },
                { text: "Pon la maceta en un lugar soleado.", emoji: "☀️" },
                { text: "Cuida tu limonero y mira cómo crece.", emoji: "👀" },
              ],
            };
            const treeName = ut.tree.name;
            return (
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
                <button
                  className="mt-2 text-green-700 underline text-sm hover:text-green-900"
                  onClick={() => setShowGuide({ open: true, tree: { name: treeName, guide: guides[treeName] || [] } })}
                >
                  ¿Cómo plantar?
                </button>
                <p className="text-xs text-gray-400">Última acción: {ut.last_action_date ? new Date(ut.last_action_date).toLocaleDateString() : "Nunca"}</p>
              </div>
            );
          })}
        </div>
      )}
      {/* Misiones diarias */}
      <MissionList />
      {/* Guía educativa modal */}
      {showGuide?.open && (
        <TreeGuide tree={showGuide.tree} onClose={() => setShowGuide(null)} />
      )}
    </main>
  );
} 