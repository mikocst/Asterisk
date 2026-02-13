import NotebookApp from "./NotebookApp";
import NotebookProvider from "./NotebookContext";

const index = () => {

  return (
    <NotebookProvider>
      <NotebookApp/>
    </NotebookProvider>
  )
}

export default index