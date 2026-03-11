import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Profile() {

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setProfile(data);
  };

  if (!profile) return <p className="p-10">Loading...</p>;

  return (

    <div className="min-h-screen bg-gray-50 pt-28">

      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-xl p-8">

        <div className="flex flex-col items-center">

          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            className="w-24 h-24 rounded-full border mb-4"
          />

          <h2 className="text-2xl font-bold text-green-700">
            {profile.name}
          </h2>

          <p className="text-gray-500">
            {profile.role}
          </p>

        </div>

        <div className="mt-6 space-y-3">

          <div className="flex justify-between border-b pb-2">
            <span>Email</span>
            <span>{profile.email}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span>Mobile</span>
            <span>{profile.mobile}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span>Status</span>
            <span>{profile.status}</span>
          </div>

        </div>

      </div>

    </div>

  );
}