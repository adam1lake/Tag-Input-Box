import { render, screen, fireEvent, findByDisplayValue } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import TagInputBox from "../lib/components/TagInputBox.jsx";
import userEvent from "@testing-library/user-event";
import { isEmailValid } from "../lib/utils";

const shuffle = unshuffled => unshuffled
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

// Sample items to be rendered
const sampleValidItems = shuffle(["test@example.com", "longertext@example.com", "abc123@example.com", "g1@anotherexample.com"]);
const sampleInvalidItems = shuffle([";;;;;;;;;", "surname_firstname", "example.net"]);

const sampleRandomItems = shuffle(["new", "unknown", "Temp1", "15%"]);

describe("tag input box", () => {
    const user = userEvent.setup();
    it("renders when every prop is provided", () => {
        const label = "Enter email above.";

        render(
            <TagInputBox
                className="emailbox"
                items={ sampleValidItems }
                setItems={ () => {} }
                validator={ () => {} }
                label={ label }
                forceLowerCase={ true }
                separators={[","]}
            />
        );

        // Queries for the elements using their test ids
        const tagContainerElement = screen.queryByTestId("tag-input-container");
        const tagInputElement = screen.queryByTestId("tag-input-box");
        const tagClearIcon = screen.queryByTestId("tag-clear-icon");
        const labelElement = screen.queryByTestId("tag-input-label");

        const itemElements = sampleValidItems.map((item, idx) => (
            screen.queryByTestId(`input-tag-${idx + 1}`)
        ));

        // All the elements are in the document
        expect(tagContainerElement).toBeInTheDocument();
        expect(tagClearIcon).toBeInTheDocument();
        itemElements.forEach(item => {
            expect(item).toBeInTheDocument();
        });

        // Checks that the label text is displayed
        expect(labelElement).toHaveTextContent(label);

        // Checks the default value (typed text) is blank
        expect(tagInputElement).toHaveValue("");
    });

    it("adds an inputted single valid item as a new tag", async () => {
        const startingEmails = sampleValidItems.slice(2, 4);
        const testValidEmail = sampleValidItems[1];

        const setItems = vi.fn();

        render(
            <TagInputBox
                items={ startingEmails }
                setItems={ setItems }
                validator={ isEmailValid }
                separators={[","]}
            />
        );

        // Gets the input element
        const tagInputElement = screen.queryByTestId("tag-input-box");

        // Enters the valid email into the input
        await user.type(tagInputElement, testValidEmail);

        // Checks that setItems has not been called
        expect(setItems).not.toHaveBeenCalled();

        // Enters a comma (default separator)
        await user.type(tagInputElement, ",");

        // Checks that setItems has been called with the valid email
        expect(setItems).toHaveBeenLastCalledWith([...startingEmails, testValidEmail]);
    });

    it("does not add a single invalid items as a new tag", async () => {
        const startingEmails = sampleValidItems.slice(0, 2);
        const testInvalidEmail = sampleInvalidItems[1];

        const setItems = vi.fn();

        render(
            <TagInputBox
                items={ startingEmails }
                setItems={ setItems }
                validator={ isEmailValid }
                separators={ ["#"] }
            />
        );

        // Gets the input element
        const tagInputElement = screen.queryByTestId("tag-input-box");

        // Enters the invalid email into the input
        await user.type(tagInputElement, testInvalidEmail);

        // Checks that setItems has not been called
        expect(setItems).not.toHaveBeenCalled();

        // Types the separator
        await user.type(tagInputElement, "#");

        // Checks that setItems has still not been called
        expect(setItems).not.toHaveBeenCalled();
    });

    it("adds multiple inputted valid items (comma-separated) as new tags", async () => {
        const startingEmails = [sampleValidItems[0]];
        const testValidEmails = sampleValidItems.slice(1, 4);

        const setItems = vi.fn();

        render(
            <TagInputBox
                items={ startingEmails }
                setItems={ setItems }
                validator={ isEmailValid }
                separators={ ["|"] }
            />
        );

        // Gets the input element
        const tagInputElement = screen.queryByTestId("tag-input-box");

        // Enters the valid emails into the input with a separator at the end
        await user.type(tagInputElement, testValidEmails.join("|") + "|");

        // Checks that setItems is called for each email (with the starting emails)
        testValidEmails.forEach(item => expect(setItems).toHaveBeenCalledWith([...startingEmails, item]));
    });

    it("does not add multiple inputted invalid items (comma-separated) as new tags", async () => {
        const setItems = vi.fn();

        render(
            <TagInputBox
                items={ sampleValidItems.slice(1, 4) }
                setItems={ setItems }
                validator={ isEmailValid }
                separators={[","]}
            />
        );

        // Gets the input element
        const tagInputElement = screen.queryByTestId("tag-input-box");

        // Enters the invalid emails into the input
        await user.type(tagInputElement, sampleInvalidItems.join(",") + ",");

        // Checks that setItem has not been called
        expect(setItems).not.toHaveBeenCalled();
    });

    it("handles a selection of valid and invalid items", async () => {
        const testEmails = shuffle([...sampleInvalidItems, ...sampleValidItems]);

        const setItems = vi.fn();

        render(
            <TagInputBox
                items={ [] }
                setItems={ setItems }
                validator={ isEmailValid }
                separators={[","]}
            />
        );

        // Gets the input element
        const tagInputElement = screen.queryByTestId("tag-input-box");

        // Loops over the emails
        for (const email of testEmails) {
            // Types the email followed by a comma
            await user.type(tagInputElement, email + ",");

            if (sampleValidItems.includes(email)) {
                // If it's a valid email, check setItems has been called
                expect(setItems).toHaveBeenLastCalledWith([email]);
            } else {
                // Iif it's an invalid email, check setItems has not been called
                expect(setItems).not.toHaveBeenCalledWith([email]);
                // Clear the input
                await user.clear(tagInputElement);
            }
        }
    });

    it("does not add duplicate emails", async () => {
        const setItems = vi.fn();

        // Starts with all valid emails as tags
        render(
            <TagInputBox
                items={ sampleValidItems }
                setItems={ setItems }
                validator={ isEmailValid }
                separators={ [";"] }
            />
        );

        // Gets the input element
        const tagInputElement = screen.queryByTestId("tag-input-box");

        // Enters all the valid emails
        await user.type(tagInputElement, sampleValidItems.join(";"));
        await user.type(tagInputElement, "{enter}");

        // Checks that setItems has not been called
        expect(setItems).not.toHaveBeenCalled();
    });

    it("saves the input on Enter press", async () => {
        const startingEmails = sampleValidItems.slice(0, 3);
        const testValidEmail = sampleValidItems[3];

        const setItems = vi.fn();

        render(
            <TagInputBox
                items={ startingEmails }
                setItems={ setItems }
                validator={ isEmailValid }
                separators={[","]}
            />
        );

        // Gets the input element
        const tagInputElement = screen.queryByTestId("tag-input-box");

        // Enters the valid email into the input
        await user.type(tagInputElement, testValidEmail);

        // Checks that setItems has not yet been called
        expect(setItems).not.toHaveBeenCalled();

        // Presses Enter
        await user.type(tagInputElement, "{enter}");

        // Checks that the new array of emails now includes all the new valid emails
        expect(setItems).toHaveBeenLastCalledWith(sampleValidItems);
    });

    it("makes the last item editable when backspace is pressed", async () => {
        const startingEmail = sampleValidItems[3];

        const setItems = vi.fn();

        render(
            <TagInputBox
                items={ [startingEmail] }
                setItems={ setItems }
                validator={ isEmailValid }
                separators={[","]}
            />
        );

        // Gets the input element
        const tagInputElement = screen.queryByTestId("tag-input-box");

        // Checks the default value (typed text) is blank
        expect(tagInputElement).toHaveValue("");

        // Presses backspace
        await user.type(tagInputElement, "{backspace}");

        // Checks that the items are set to empty
        expect(setItems).toHaveBeenLastCalledWith([]);

        // Types backspace to make the item editable, then adds .uk
        await user.type(tagInputElement, "{backspace}");
        await user.type(tagInputElement, ".uk");

        // Checks that the function hasn't been called again, as the last call was still an empty array
        expect(setItems).toHaveBeenLastCalledWith([]);

        // Enters a comma
        await user.type(tagInputElement, ",");

        // Checks that the input has now been cleared
        expect(tagInputElement).toHaveValue("");

        // Checks that the list of items has been updated
        // Note that as the state variable doesn't get updated, the setItems function gets called with the new email
        // as well as the original one
        expect(setItems).toHaveBeenLastCalledWith([startingEmail, startingEmail.slice(0, startingEmail.length - 1) + ".uk"]);
    });

    it("handles different separators/splitters", async () => {
        const separators = [",", "&", ";", "-"];
        const testString = sampleRandomItems.map((item, idx) => item + separators[idx]).join("");

        const setItems = vi.fn();

        render(
            <TagInputBox
                items={ [] }
                setItems={ setItems }
                validator={ () => true }
                separators={ separators }
            />
        );

        // Gets the input element
        const tagInputElement = screen.queryByTestId("tag-input-box");

        // Enters the string list of emails into the input
        await user.type(tagInputElement, testString);
        await user.type(tagInputElement, "{enter}");

        // Checks that setItems has been called for each item
        sampleRandomItems.forEach(item => expect(setItems).toHaveBeenCalledWith([item]));
    });

    // TODO - add case tests
    //  keyboard shortcut tests
    //  Paste tests
});