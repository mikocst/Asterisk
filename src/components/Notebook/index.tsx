import NotebookApp from "./NotebookApp";
import NotebookProvider from "./NotebookContext";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import React from "react";

const index = () => {

  const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL)

  return (
    <React.StrictMode>
       <ConvexProvider client = {convex}>
          <NotebookProvider>
            <NotebookApp/>
          </NotebookProvider>
       </ConvexProvider>
    </React.StrictMode>
  )
}

export default index