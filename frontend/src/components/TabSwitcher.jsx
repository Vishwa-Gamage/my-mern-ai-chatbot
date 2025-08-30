import React, { useState } from "react";
import Markdown from "./Markdown";

const TabSwitcher = () => {
  const [activeTab, setActiveTab] = useState("markdown");

  return (
    <div className="p-4">
      <div className="flex border-b mb-2">
        <button
          className={`px-4 py-2 ${activeTab === "markdown" ? "border-b-2 border-blue-500 font-bold" : ""}`}
          onClick={() => setActiveTab("markdown")}
        >
          Markdown
        </button>
        <button
          className={`px-4 py-2 ${activeTab === "review" ? "border-b-2 border-blue-500 font-bold" : ""}`}
          onClick={() => setActiveTab("review")}
        >
          Code Review
        </button>
      </div>

      <div>
        {activeTab === "markdown" && <Markdown />}
        {activeTab === "review" && (
          <Markdown /> // Reuse Markdown for code review feature
        )}
      </div>
    </div>
  );
};

export default TabSwitcher;
