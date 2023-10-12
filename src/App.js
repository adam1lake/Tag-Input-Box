import TagInputBox from "./lib/components/TagInputBox";
import { useState } from "react";

const isEmailValid = input => /^[^@]+@[^@]+\.[^@]+$/.test(input);

function App() {
  const [emails, setEmails] = useState([]);

  return (
    <div className="App">
        <TagInputBox
            items={ emails }
            setItems={ setEmails }
            validator={ isEmailValid }
            label="Emails:"
            autoSubmit={ true }
        />
    </div>
  );
}

export default App;
