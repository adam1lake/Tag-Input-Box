import TagInputBox from "./lib/components/TagInputBox";
import { useState } from "react";

function App() {
  const [items, setItems] = useState([]);
  return (
    <div className="App">
      <TagInputBox
          setItems={ val => setItems(val) }
          validator={ item => item.includes(".com") }
          items={ items }
          label="Emails:"
          autoValidate={ true }
      />
    </div>
  );
}

export default App;
