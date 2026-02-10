import NoteArea from "./NoteArea/NoteArea";
import NoteMenu from "./Menu/NoteMenu";
import NotebookProvider from "./NotebookContext";

const index = () => {
  return (
    <NotebookProvider>
      <div className = "flex flex-row h-full">
        <NoteMenu/>
        <NoteArea/>
      </div>
    </NotebookProvider>
  )
}

export default index