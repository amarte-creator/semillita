"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import BadgeList from "@/components/BadgeList";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [treesCount, setTreesCount] = useState(0);
  const [missionsCount, setMissionsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        router.replace("/signup");
        return;
      }
      // Datos usuario
      const { data: userRow } = await supabase
        .from("users")
        .select("nickname, avatar, eco_points")
        .eq("id", authData.user.id)
        .single();
      setUser(userRow);
      // Árboles plantados
      const { count: trees } = await supabase
        .from("user_trees")
        .select("id", { count: "exact", head: true })
        .eq("user_id", authData.user.id);
      setTreesCount(trees || 0);
      // Misiones completadas
      const { count: missions } = await supabase
        .from("user_missions")
        .select("id", { count: "exact", head: true })
        .eq("user_id", authData.user.id);
      setMissionsCount(missions || 0);
      setLoading(false);
    };
    fetchData();
  }, [router]);

  if (loading) return <div className="flex justify-center items-center min-h-screen">Cargando perfil...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!user) return null;

  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-b from-blue-100 to-green-50 font-sans py-10">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
        <img src={user.avatar} alt="avatar" className="w-24 h-24 rounded-full bg-green-100 mb-2" />
        <h1 className="text-2xl font-bold text-green-800 mb-1">{user.nickname}</h1>
        <p className="text-green-700 mb-2">Puntos ecológicos: <span className="font-bold">{user.eco_points}</span></p>
        <p className="text-green-700 mb-2">Árboles plantados: <span className="font-bold">{treesCount}</span></p>
        <p className="text-green-700 mb-2">Misiones completadas: <span className="font-bold">{missionsCount}</span></p>
        <BadgeList ecoPoints={user.eco_points} treesCount={treesCount} missionsCount={missionsCount} />
      </div>
    </main>
  );
} 