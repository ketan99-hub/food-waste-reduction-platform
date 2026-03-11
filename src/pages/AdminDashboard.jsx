import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function AdminDashboard() {

  const [ngos, setNgos] = useState([]);

  useEffect(() => {
    fetchNGOs();
  }, []);

  const fetchNGOs = async () => {

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "ngo")
      .eq("status", "pending");

    setNgos(data);

  };

  const approveNGO = async (id) => {

    await supabase
      .from("profiles")
      .update({ status: "approved" })
      .eq("id", id);

    fetchNGOs();

  };

  const rejectNGO = async (id) => {

    await supabase
      .from("profiles")
      .delete()
      .eq("id", id);

    fetchNGOs();

  };

  return (

    <div className="pt-28 max-w-5xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">
        NGO Approval Panel
      </h1>

      {ngos.length === 0 && (
        <p>No pending NGOs</p>
      )}

      {ngos.map((ngo) => (

        <div
          key={ngo.id}
          className="border p-4 rounded-lg mb-4 flex justify-between items-center"
        >

          <div>

            <h2 className="font-semibold text-lg">
              {ngo.name}
            </h2>

            <p>{ngo.mobile}</p>
            <p>{ngo.ngo_address}</p>
            <p>Reg: {ngo.ngo_reg}</p>

          </div>

          <div className="flex gap-3">

            <button
              onClick={() => approveNGO(ngo.id)}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Approve
            </button>

            <button
              onClick={() => rejectNGO(ngo.id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Reject
            </button>

          </div>

        </div>

      ))}

    </div>

  );
}