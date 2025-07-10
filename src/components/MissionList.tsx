"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Mission {
  id: string;
  name: string;
  description: string;
  points: number;
}

interface UserMission {
  mission_id: string;
  completed_at: string;
}

export default function MissionList() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [userMissions, setUserMissions] = useState<UserMission[]>([]);
  const [ecoPoints, setEcoPoints] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  // Obtener misiones, misiones del usuario y puntos
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setError("Debes estar logueado");
        setLoading(false);
        return;
      }
      setUserId(userData.user.id);
      // Misiones
      const { data: missionsData } = await supabase.from("missions").select("*");
      setMissions(missionsData || []);
      // Misiones del usuario hoy
      const today = new Date().toISOString().slice(0, 10);
      const { data: userMissionsData } = await supabase
        .from("user_missions")
        .select("mission_id, completed_at")
        .eq("user_id", userData.user.id)
        .gte("completed_at", today + "T00:00:00")
        .lte("completed_at", today + "T23:59:59");
      setUserMissions(userMissionsData || []);
      // Eco points
      const { data: userRow } = await supabase
        .from("users")
        .select("eco_points")
        .eq("id", userData.user.id)
        .single();
      setEcoPoints(userRow?.eco_points || 0);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleComplete = async (mission: Mission) => {
    if (!userId) return;
    setLoading(true);
    // Insertar en user_missions
    await supabase.from("user_missions").insert({
      user_id: userId,
      mission_id: mission.id,
      completed_at: new Date().toISOString(),
    });
    // Sumar puntos
    await supabase
      .from("users")
      .update({ eco_points: ecoPoints + mission.points })
      .eq("id", userId);
    // Refrescar datos
    const today = new Date().toISOString().slice(0, 10);
    const { data: userMissionsData } = await supabase
      .from("user_missions")
      .select("mission_id, completed_at")
      .eq("user_id", userId)
      .gte("completed_at", today + "T00:00:00")
      .lte("completed_at", today + "T23:59:59");
    setUserMissions(userMissionsData || []);
    setEcoPoints(ecoPoints + mission.points);
    setLoading(false);
  };

  if (loading) return <div className="text-center">Cargando misiones...</div>;

  return (
    <section className="w-full max-w-lg bg-white rounded-3xl shadow-md p-6 mt-8 flex flex-col items-center">
      <h3 className="text-xl font-bold text-green-700 mb-2">Misiones diarias</h3>
      <p className="text-green-800 mb-4">Puntos ecológicos: <span className="font-bold">{ecoPoints}</span></p>
      {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}
      <ul className="w-full flex flex-col gap-3">
        {missions.map((mission) => {
          const completed = userMissions.some((um) => um.mission_id === mission.id);
          return (
            <li key={mission.id} className="flex items-center justify-between bg-green-50 rounded-xl px-4 py-3">
              <div>
                <span className={`font-semibold ${completed ? "line-through text-gray-400" : "text-green-900"}`}>{mission.name}</span>
                <p className="text-xs text-green-700">{mission.description}</p>
              </div>
              <button
                className={`ml-4 w-8 h-8 rounded-full border-2 flex items-center justify-center ${completed ? "bg-green-300 border-green-400" : "bg-white border-green-400 hover:bg-green-100"}`}
                disabled={completed}
                onClick={() => handleComplete(mission)}
                title={completed ? "Completada" : "Marcar como completada"}
              >
                {completed ? "✔️" : "+"}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
} 