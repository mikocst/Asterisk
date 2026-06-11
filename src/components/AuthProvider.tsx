import React from "react";
import { useAuth} from '@clerk/astro/react';
import {ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";

const convexClient = new ConvexReactClient(import.meta.env.PUBLIC_CONVEX_URL);

export function AuthProvider({children}: {children: React.ReactNode}) {
    return(
            <ConvexProviderWithClerk client = {convexClient} useAuth={useAuth}>
                {children}
            </ConvexProviderWithClerk>
    )
}