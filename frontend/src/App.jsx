import React, { useState } from "react";
import "./App.css"; 
import axios from "axios";

function App() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [explanations, setExplanations] = useState(null);
  const [error, setError] = useState(null);
  const [preferredAge, setPreferredAge] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://localhost:8000/explain", {
        params: { topic },
      });
      setExplanations(res.data);
    } catch (err) {
      console.error(err);
      setError("Oops! Something went wrong.");
      setExplanations(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-white px-4 py-10 flex flex-col items-center">
      <h1 className="text-3xl sm:text-5xl font-extrabold mb-6 text-center bg-gradient-to-r from-blue-400 via-green-400 to-pink-400 text-transparent bg-clip-text">
        Explain Like I’m 5 / 15 / 25
      </h1>

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic like 'AI' or 'Taxes'"
          className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-600 text-white placeholder-zinc-400 focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Explaining..." : "Explain It!"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {explanations && (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 w-full max-w-6xl">
    <ExplanationCard
      age="5"
      emoji="🧒"
      points={explanations.age_5}
    />
    <ExplanationCard
      age="15"
      emoji="👦"
      points={explanations.age_15}
    />
    <ExplanationCard
      age="25"
      emoji="🧑"
      points={explanations.age_25}
    />
  </div>
)}

    </div>
  );
}

function ExplanationCard({ age, emoji, points }) {
  return (
    <div className="flex flex-col justify-between bg-zinc-900 p-6 rounded-xl shadow-md border border-zinc-700 transition-all">
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 text-yellow-300">
          <span className="text-2xl">{emoji}</span>
          Explained to a {age}-year-old:
        </h2>
        <ul className="list-disc pl-5 space-y-2 text-zinc-100">
          {points && points.length > 0 ? (
            points.map((point, idx) => <li key={idx}>{point}</li>)
          ) : (
            <li>Explanation not available.</li>
          )}
        </ul>
      </div>
    </div>
  );
}


export default App;
