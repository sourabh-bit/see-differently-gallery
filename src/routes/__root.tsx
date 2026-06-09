import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import { Cursor } from "@/components/Cursor";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-6 md:px-12 text-paper">
      <div
        aria-hidden
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 15%, rgba(255,255,255,0.08), transparent 26%), radial-gradient(circle at 80% 10%, rgba(255,255,255,0.05), transparent 22%), repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 72px), repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 72px)",
        }}
      />
      <div aria-hidden className="absolute inset-0 grain opacity-50" />
      <div className="relative mx-auto max-w-2xl text-center">
        <div className="mono text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-paper/55 mb-6">
          Page not found
        </div>
        <h1 className="serif text-5xl md:text-7xl leading-none">404</h1>
        <p className="mx-auto mt-5 max-w-lg text-paper/70 text-sm md:text-base leading-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-paper px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-paper/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-6 md:px-12 text-paper">
      <div
        aria-hidden
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 15%, rgba(255,255,255,0.08), transparent 26%), radial-gradient(circle at 80% 10%, rgba(255,255,255,0.05), transparent 22%), repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 72px), repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 72px)",
        }}
      />
      <div aria-hidden className="absolute inset-0 grain opacity-50" />
      <div className="relative mx-auto max-w-2xl text-center">
        <div className="mono text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-paper/55 mb-6">
          Something went wrong
        </div>
        <h1 className="serif text-5xl md:text-7xl leading-none">This page didn&apos;t load.</h1>
        <p className="mx-auto mt-5 max-w-lg text-paper/70 text-sm md:text-base leading-6">
          We hit a snag on our end. Try again or head back home.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-paper px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-paper/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-paper/15 bg-transparent px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-paper/10"
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
      { title: "See Differently" },
      {
        name: "description",
        content: "See Differently is a mobile photography masterclass and editorial workshop.",
      },
      { name: "author", content: "Seen/Differently Studio" },
      { property: "og:title", content: "See Differently" },
      {
        property: "og:description",
        content: "A mobile photography masterclass and editorial workshop.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Cursor />
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
