import React, { useState } from "react";
import axios from "axios";

function App() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [explanations, setExplanations] = useState(null);
  const [error, setError] = useState(null);

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
      console.log
      console.error(err);
      setError("Something went wrong. Please try again.");
      setExplanations(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6">Explain Like I’m 5 / 15 / 25</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic (e.g. Blockchain)"
          className="w-full p-3 rounded border mb-4"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Explaining..." : "Explain"}
        </button>
      </form>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {explanations && (
        <div className="grid gap-6 mt-8 w-full max-w-3xl">
          <ExplanationCard age="5" points={explanations.age_5} />
          <ExplanationCard age="15" points={explanations.age_15} />
          <ExplanationCard age="25" points={explanations.age_25} />
        </div>
      )}
    </div>
  );
}

function ExplanationCard({ age, points }) {
  const emojis = {
    "5": "🧒",
    "15": "👦",
    "25": "🧑",
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">
        {emojis[age]} Explained to a {age}-year-old:
      </h2>
      <ul className="list-disc pl-5 space-y-1 text-gray-700">
        {points.map((point, idx) => (
          <li key={idx}>{point}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
