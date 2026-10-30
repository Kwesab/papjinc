import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { profileQuery } from "@/lib/db";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">404</p>
      <h1 className="mt-4 text-5xl font-semibold tracking-tight text-foreground sm:text-7xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-sm text-sm text-muted-foreground">
        That URL doesn't exist or the page has moved. Head back to the homepage to find what you're looking for.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Go home
        </Link>
        <Link
          to="/projects"
          className="inline-flex items-center justify-center rounded-md border border-input bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          View projects
        </Link>
        <Link
          to="/contact"
          className="inline-flex items-center justify-center rounded-md border border-input bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Contact
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "PAP_J Inc. — Software, AI & Digital Products" },
      {
        name: "description",
        content:
          "PAP_J Inc. is a technology company building practical software, intelligent systems and digital products. Based in Ghana, serving clients worldwide.",
      },
      { name: "author", content: "Albert Prah" },
      { property: "og:title", content: "PAP_J Inc. — The Future is Exciting." },
      {
        property: "og:description",
        content: "Software, AI & Digital Products — built to solve real-world problems.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/og-image.svg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "/og-image.svg" },
      { name: "theme-color", content: "#d97706" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "PAP_J" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
      },
      { rel: "icon", href: "/logo.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/logo.png" },
      { rel: "manifest", href: "/manifest.json" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

const themeScript = `(function(){try{var s=localStorage.getItem('ap-theme');var d=s?s==='dark':true;document.documentElement.classList.toggle('dark',d);}catch(e){document.documentElement.classList.add('dark');}})();`;

const swScript = `if('serviceWorker' in navigator){window.addEventListener('load',function(){
  // Unregister any old service workers first, then register the latest
  navigator.serviceWorker.getRegistrations().then(function(regs){
    var unregisterAll = regs.map(function(r){ return r.unregister(); });
    return Promise.all(unregisterAll);
  }).then(function(){
    navigator.serviceWorker.register('/sw.js').catch(function(){});
  });
})}`;

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: swScript }} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => data.subscription.unsubscribe();
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <FaviconUpdater />
      <Outlet />
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}

/** Runs inside QueryClientProvider so useQuery is safe to call here */
function FaviconUpdater() {
  const { data: profile } = useQuery(profileQuery);

  useEffect(() => {
    const faviconUrl = (profile as Record<string, unknown> | undefined)?.["favicon_url"] as string | undefined;
    if (!faviconUrl) return;
    const existingLink = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
    if (existingLink) {
      existingLink.href = faviconUrl;
    } else {
      const link = document.createElement("link");
      link.rel = "icon";
      link.href = faviconUrl;
      document.head.appendChild(link);
    }
    const appleLink = document.querySelector<HTMLLinkElement>("link[rel='apple-touch-icon']");
    if (appleLink) appleLink.href = faviconUrl;
  }, [profile]);

  return null;
}
