import {render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import TagInputBox from "../lib/components/TagInputBox";
import userEvent from "@testing-library/user-event";

const shuffle = (unshuffled) => unshuffled
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

// Sample items to be rendered
const sampleValidItems = shuffle(["test@example.com", "longertext@example.com", "abc123@example.com", "g1@anotherexample.com"]);
const sampleInvalidItems = shuffle([";;;;;;;;;", "surname_firstname", "example.net"]);

const sampleRandomItems = shuffle(["new", "unknown", "Temp1", "15%"]);

// Sample validator, testing whether a string includes .com
const sampleValidator = item => item.includes(".com");

describe("tag input box", () => {
    it("renders when every prop is provided", () => {
        const label = "Enter email above.";

        render(
            <TagInputBox
                className="emailbox"
                items={ sampleValidItems }
                setItems={ () => {} }
                validator={ () => {} }
                autoSubmit={ true }
                label={ label }
                forceLowerCase={ true }
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

    it("adds an inputted single valid item as a new tag (auto validate on)", () => {
        const startingEmails = sampleValidItems.slice(0, 3);
        const testValidEmail = sampleValidItems[3];

        // testValue will store the array of emails returned by the on change function
        let testValue = [];

        render(
            <TagInputBox
                items={ startingEmails }
                setItems={ e => testValue = e }
                validator={ sampleValidator }
                autoSubmit={ true }
            />
        );

        // Gets the input element
        const tagInputElement = screen.queryByTestId("tag-input-box");

        // Enters the valid email into the input
        fireEvent.change(tagInputElement, {target: {value: testValidEmail}});
        // Checks that the new array of emails includes the new email
        expect(testValue).toEqual(sampleValidItems);
    });

    it("adds an inputted single valid item as a new tag (auto validate off)", () => {
        const startingEmails = sampleValidItems.slice(2, 4);
        const testValidEmail = sampleValidItems[1];

        const setItems = jest.fn();

        render(
            <TagInputBox
                items={ startingEmails }
                setItems={ setItems }
                validator={ sampleValidator }
                autoSubmit={ false }
            />
        );

        // Gets the input element
        const tagInputElement = screen.queryByTestId("tag-input-box");

        // Enters the valid email into the input
        fireEvent.change(tagInputElement, { target: { value: testValidEmail } });
        // Checks that setItems has not been called
        expect(setItems).not.toHaveBeenCalled();
    });

    it("does not add a single invalid item as a new tag (auto validate on)", () => {
        const startingEmails = [sampleValidItems[0]];
        const testInvalidEmail = sampleInvalidItems[0];

        const setItems = jest.fn();

        render(
            <TagInputBox
                items={ startingEmails }
                setItems={ setItems }
                validator={ sampleValidator }
                autoSubmit={ true }
            />
        );

        // Gets the input element
        const tagInputElement = screen.queryByTestId("tag-input-box");

        // Enters the invalid email into the input
        fireEvent.change(tagInputElement, { target: { value: testInvalidEmail } });
        // Checks that setItems has not been called
        expect(setItems).not.toHaveBeenCalled();
    });

    it("does not add a single invalid items as a new tag (auto validate off)", () => {
        const startingEmails = sampleValidItems.slice(0, 2);
        const testInvalidEmail = sampleInvalidItems[1];

        // testValue will store the array of emails returned by the on change function
        // let testValue = [...startingEmails];

        const setItems = jest.fn();

        render(
            <TagInputBox
                items={ startingEmails }
                setItems={ setItems }
                validator={ sampleValidator }
                autoSubmit={ false }
            />
        );

        // Gets the input element
        const tagInputElement = screen.queryByTestId("tag-input-box");

        // Enters the invalid email into the input
        fireEvent.change(tagInputElement, { target: { value: testInvalidEmail } });
        fireEvent.keyUp(tagInputElement);
        // Checks that the setItems function has not been called
        expect(setItems).not.toHaveBeenCalled();
    });

    it("adds multiple inputted valid items (comma-separated) as new tags (auto validate on)", () => {
        const startingEmails = [sampleValidItems[0]];
        const testValidEmails = sampleValidItems.slice(1, 4);

        // testValue will store the array of emails returned by the on change function
        let testValue = [];

        render(
            <TagInputBox
                className="Email-List"
                items={ startingEmails }
                setItems={ e => testValue = e }
                validator={ sampleValidator }
                autoSubmit={ true }
            />
        );

        // Gets the input element
        const tagInputElement = screen.queryByTestId("tag-input-box");

        // Enters the valid emails into the input
        fireEvent.change(tagInputElement, { target: { value: testValidEmails.join(",") } });
        // Checks that the new array of emails includes the new email
        expect(testValue).toEqual(sampleValidItems);
    });

    it("adds multiple inputted valid items (comma-separated) as new tags (auto validate off)", () => {
        const startingEmails = [sampleValidItems[0]];
        const testValidEmails = sampleValidItems.slice(1, 4);

        const setItems = jest.fn();

        render(
            <TagInputBox
                items={ startingEmails }
                setItems={ setItems }
                validator={ sampleValidator }
                autoSubmit={ false }
            />
        );

        // Gets the input element
        const tagInputElement = screen.queryByTestId("tag-input-box");

        // Enters the valid emails into the input
        fireEvent.change(tagInputElement, { target: { value: testValidEmails.join(",") } });
        // Checks that the new array of emails includes the new email
        expect(setItems).not.toHaveBeenCalled();
    });

    it("does not add multiple inputted invalid items (comma-separated) as new tags (auto validate on)", () => {
        const setItems = jest.fn();

        render(
            <TagInputBox
                items={ sampleValidItems.slice(1, 4) }
                setItems={ setItems }
                validator={ sampleValidator }
                autoSubmit={ true }
            />
        );

        // Gets the input element
        const tagInputElement = screen.queryByTestId("tag-input-box");

        // Enters the invalid emails into the input
        fireEvent.change(tagInputElement, { target: { value: sampleInvalidItems.join(",") } });
        // Checks that setItem has not been called
        expect(setItems).not.toHaveBeenCalled();
    });

    it("does not add multiple inputted invalid items (comma-separated) as new tags (auto validate off)", () => {
        const setItems = jest.fn();

        render(
            <TagInputBox
                items={ [] }
                setItems={ setItems }
                validator={ sampleValidator }
                autoSubmit={ true }
            />
        );

        // Gets the input element
        const tagInputElement = screen.queryByTestId("tag-input-box");

        // Enters the invalid emails into the input
        fireEvent.change(tagInputElement, { target: { value: sampleInvalidItems.join(",") } });
        // Checks that setItem has not been called
        expect(setItems).not.toHaveBeenCalled();
    });

    it("handles a selection of valid and invalid items (auto validate on)", () => {
        const testEmails = shuffle([...sampleValidItems, ...sampleInvalidItems]);

        // testValue will store the array of emails returned by the on change function
        let testValue = [];

        render(
            <TagInputBox
                items={ [] }
                setItems={ e => testValue = e }
                validator={ sampleValidator }
                autoSubmit={ true }
            />
        );

        // Gets the input element
        const tagInputElement = screen.queryByTestId("tag-input-box");

        // Enters the mix of valid and invalid emails into the input
        fireEvent.change(tagInputElement, { target: { value: testEmails.join(",") } });

        // Checks that the new array of emails includes all the new valid emails only (empty string is removed)
        expect(testValue).toEqual(testEmails.filter(item => sampleValidItems.includes(item)));
    });

    it("does not add duplicate emails (auto validate on)", () => {
        const setItems = jest.fn();

        // Starts with all valid emails as tags
        render(
            <TagInputBox
                items={ sampleValidItems }
                setItems={ setItems }
                validator={ sampleValidator }
            />
        );

        // Gets the input element
        const tagInputElement = screen.queryByTestId("tag-input-box");

        // Enters all the valid emails
        fireEvent.change(tagInputElement, { target: { value: sampleValidItems.join(",") } });

        // Checks that setItems has not been called
        expect(setItems).not.toHaveBeenCalled();
    });

    it("saves the input on Enter press when auto validate is off", async () => {
        const startingEmails = sampleValidItems.slice(0, 3);
        const testValidEmail = sampleValidItems[3];

        // testValue will store the array of emails returned by the on change function
        let testValue = [];

        render(
            <TagInputBox
                items={ startingEmails }
                setItems={ e => testValue = e }
                validator={ sampleValidator }
                autoSubmit={ false }
            />
        );

        // Gets the input element
        const tagInputElement = screen.queryByTestId("tag-input-box");

        act(() => {
            // Enters the valid email into the input
            userEvent.type(tagInputElement, testValidEmail);

            // Checks that setItems has not yet been called
            expect(testValue).toEqual([]);

            // Presses Enter
            userEvent.type(tagInputElement, "{enter}");

            // Checks that the new array of emails now includes all the new valid emails
            expect(testValue).toEqual(sampleValidItems);
        })
    });

    it("saves the input on Comma press when auto validate is off", () => {
        const startingEmails = sampleValidItems.slice(0, 2);
        const testValidEmails = sampleValidItems.slice(2, 4);

        // testValue will store the array of emails returned by the on change function
        let testValue = [];

        render(
            <TagInputBox
                items={ startingEmails }
                setItems={ e => testValue = e }
                validator={ sampleValidator }
                autoSubmit={ false }
            />
        );

        // Gets the input element
        const tagInputElement = screen.queryByTestId("tag-input-box");

        // Enters all the valid emails
        fireEvent.change(tagInputElement, { target: { value: testValidEmails.join(",") } });

        // Checks that setItems has not yet been called
        expect(testValue).toEqual([]);

        // Enters all the valid emails, this time with a comma at the end
        fireEvent.change(tagInputElement, { target: { value: testValidEmails.join(",") + "," } });

        // Checks that the new array of emails now includes all the new valid emails
        expect(testValue).toEqual(sampleValidItems);
    });

    it("makes the last item editable when backspace is pressed", async () => {
        const startingEmail = sampleValidItems[3];

        // testValue will store the array of emails returned by the on change function
        let testValue = [startingEmail];

        render(
            <TagInputBox
                items={ [startingEmail] }
                setItems={ e => testValue = e }
                validator={ sampleValidator }
                autoSubmit={ true }
            />
        );

        // Gets the input element
        const tagInputElement = screen.queryByTestId("tag-input-box");

        // Checks the default value (typed text) is blank
        expect(tagInputElement).toHaveValue("");

        await act(() => {
            // Presses backspace
            userEvent.type(tagInputElement, "{backspace}");
        });

        // Checks that the list of items is now empty
        expect(testValue).toStrictEqual([]);


        // Checks that the input value is now the starting email
        await screen.findByDisplayValue(startingEmail);

        // String to be added to the end of the input
        const testPostFix = ".com";

        act(() => {
            // The new string is inputted
            userEvent.type(tagInputElement, testPostFix);
        });

        // Ensures the input value still contains the text, i.e. it hasn't been auto validated
        await screen.findByDisplayValue(startingEmail + testPostFix);

        // Checks that the list of items is still empty
        expect(testValue).toEqual([]);

        await act(() => {
            // Presses Enter
            userEvent.type(tagInputElement, ",");
        });

        // Checks that the list of items has been updated
        expect(testValue).toEqual([startingEmail, startingEmail + testPostFix]);

        // Checks that the input has now been cleared
        expect(tagInputElement).toHaveValue("");
    });

    it("handles different separators/splitters", () => {
        const separators = [",", "&", ";", ""];
        const testString = sampleRandomItems.map((item, idx) => item + separators[idx]).join("");

        // testValue will store the array of emails returned by the on change function
        let testValue = [];

        render(
            <TagInputBox
                items={ [] }
                setItems={ e => testValue = e }
                autoSubmit={ true }
                separators={ separators.slice(0, 3) }
            />
        );

        // Gets the input element
        const tagInputElement = screen.queryByTestId("tag-input-box");

        // Enters the string list of emails into the input
        fireEvent.change(tagInputElement, { target: { value: testString } });
        console.log(testString)

        // Checks that the new array of emails includes the new email
        expect(testValue).toEqual(sampleRandomItems);
    });

    // TODO - add case tests
});