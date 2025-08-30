import React, { useState } from "react";

const Markdown = () => {
  const [text, setText] = useState("");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleReview = async () => {
    if (!text.trim()) return setError("Please enter code to review");
    setLoading(true);
    setError("");
    setReview("");

    try {
      const res = await fetch("http://localhost:5000/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: text }),
      });

      const data = await res.json();
      if (res.ok) {
        setReview(data.review);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold mb-2">Markdown + Code Reviewer</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write Markdown or paste code here..."
        className="w-full h-40 p-2 border rounded mb-2"
      />
      <div className="flex gap-2">
        <button
          onClick={handleReview}
          className="px-4 py-2 bg-blue-500 text-white rounded"
          disabled={loading}
        >
          {loading ? "Reviewing..." : "Review Code"}
        </button>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {review && (
        <div className="mt-4 p-2 border rounded bg-gray-100">
          <h3 className="font-bold mb-1">AI Review:</h3>
          <pre>{review}</pre>
        </div>
      )}
    </div>
  );
};

export default Markdown;
