import TagInputBox from "./lib/components/TagInputBox";
import React, { useState } from "react";

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
        />
    </div>
  );
}

export default App;
