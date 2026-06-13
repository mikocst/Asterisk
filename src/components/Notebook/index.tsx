import NotebookProvider from "./NotebookContext";
import React from "react";
import NotebookApp from "./NotebookApp"; 
import { ConvexReactClient, Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { SignInButton } from "@clerk/astro/react";
import { useAuth } from "@clerk/astro/react";
import { useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";


const convexUrl = import.meta.env.PUBLIC_CONVEX_URL;

const convex = new ConvexReactClient(convexUrl);

function WorkspaceSyncShell() {
  const syncUser = useMutation(api.users.storeUser);

  useEffect(() => {
    syncUser().catch((err) => console.error("Failed to provision workspace session:", err))
  }, [syncUser])

  return <NotebookApp/>
}

const Index = () => {
  return (
    <React.StrictMode>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <NotebookProvider>
          <AuthLoading>
            <div className="flex h-screen w-screen items-center justify-center bg-neutral-900">
              <p className="animate-pulse text-sm font-medium text-neutral-400">
                Syncing workspace...
              </p>
            </div>
          </AuthLoading>
          <Unauthenticated>
            <div className="flex h-screen w-screen flex-col items-center justify-center gap-6 bg-neutral-900 text-white font-sans">
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold tracking-tight">Asterisk</h1>
                <p className="text-sm text-neutral-400">Sign in to access your secure note workspace.</p>
              </div>
              <SignInButton mode="modal">
                <button className="rounded-md bg-neutral-100 px-4 py-2 text-sm font-semibold text-neutral-950 transition-all hover:bg-neutral-200 active:scale-[0.98]">
                  Sign In
                </button>
              </SignInButton>
            </div>
          </Unauthenticated>
          <Authenticated>
            <WorkspaceSyncShell/>
          </Authenticated>
        </NotebookProvider>
      </ConvexProviderWithClerk>
    </React.StrictMode>
  );
};

export default Index;