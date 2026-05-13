import { useState } from "react";

function useCommuteAI() {
  const [recommendation, setRecommendation] =
    useState(null);

  const generateAIRecommendation = () => {
    const mockRecommendation = {
      bestTime: "7:15 AM",
      traffic: "Moderate Traffic",
      suggestion: "Use MRT to avoid congestion",
    };

    setRecommendation(mockRecommendation);
  };

  return {
    recommendation,
    generateAIRecommendation,
  };
}

export default useCommuteAI;