import { useState } from "react";

function useRoutes() {
  const [routes, setRoutes] = useState([]);

  const generateMockRoutes = () => {
    const mockRoutes = [
      {
        from: "Quezon City",
        to: "Makati",
        duration: "42 mins",
        fare: "₱42",
      },

      {
        from: "Pasig",
        to: "BGC",
        duration: "35 mins",
        fare: "₱35",
      },
    ];

    setRoutes(mockRoutes);
  };

  return {
    routes,
    generateMockRoutes,
  };
}

export default useRoutes;