import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Cache data for 5 minutes — avoids refetching on every page navigation
        staleTime: 5 * 60 * 1000,
        // Keep unused data in cache for 10 minutes
        gcTime: 10 * 60 * 1000,
        // Don't retry on error more than once (avoids long waits on bad connections)
        retry: 1,
        // Refetch when the window regains focus so data stays fresh
        refetchOnWindowFocus: true,
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    // Preload linked routes when hovering — data is already in cache so it
    // feels instant when the user clicks
    defaultPreload: "intent",
    // Use the staleTime above instead of always refetching on preload
    defaultPreloadStaleTime: 5 * 60 * 1000,
  });

  return router;
};
