import NotebookProvider from "./NotebookContext";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import React from "react";
import NotebookApp from "./NotebookApp"; // Assuming this is your main app component

// 1. Initialize OUTSIDE the component
const convexUrl = import.meta.env.PUBLIC_CONVEX_URL;

const convex = new ConvexReactClient(convexUrl);

const Index = () => {
  return (
    <React.StrictMode>
       <ConvexProvider client={convex}>
          <NotebookProvider>
            <NotebookApp />
          </NotebookProvider>
       </ConvexProvider>
    </React.StrictMode>
  );
};

export default Index;