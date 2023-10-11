import "./styles.css";
import PropTypes from "prop-types";
import { useRef, useState } from "react";

const TagInputBox = ({ className, items, setItems, validator, autoValidate, label, separators, forceLowerCase }) => {
    const [textInput, setTextInput] = useState("");
    const [selectedItems, setSelectedItems] = useState([]);
    const [pendingUpdate, setPendingUpdate] = useState(false);

    // If no validator is provided, set it as a function that always returns true
    if (typeof validator === "undefined") {
        validator = () => true;
    }

    // If no separators are provided, the default is a comma
    separators = separators || [","];

    forceLowerCase = forceLowerCase || false;

    const inputRef = useRef(null);

    // Deletes all selected items
    const deleteAllSelected = () => {
        setItems(items.filter(item => !selectedItems.includes(item)));
        setSelectedItems([]);
    }

    // Called on keyup on the input box
    const handleKeyPress = e => {
        const key = e.key;

        if (key === "Backspace") {
            // If backspace is clicked and there is no input
            if (textInput === "") {
                if (e.ctrlKey) {
                    // If CTRL is being held, remove the selected items
                    if (selectedItems.length > 0) {
                        // If items are selected, delete all the selected items
                        deleteAllSelected();
                    } else {
                        // If no items are selected, delete the last item
                        setItems(items.slice(0, items.length - 1));
                    }

                } else {
                    // If CTRL is not being held, make the last item editable
                    setEditableItem(items[items.length - 1]);
                }
            }
        } else if (key === "Enter") {
            // If enter is clicked, remove the pending update to "override" it and save the item
            handleInputChange(textInput, true);
        } else if (key === "Delete" && textInput === "") {
            // If delete is clicked and there is no input, remove the selected items
            deleteAllSelected();
        } else {
            handleInputChange(textInput);
        }
    }

    // Makes the specified item available for editing by moving it into the input box
    const setEditableItem = (value) => {
        // Sets the item to be pending update
        setPendingUpdate(true);

        // Sets the input box to this item
        setTextInput(value);

        // Removes this item from the items list
        setItems(items.filter(item => item !== value));

        // Removes this item from the selected items
        setSelectedItems(selectedItems.filter(item => item !== value));
    }

    // Handles the action to take when an item is clicked
    const handleItemClick = (e, clickedItem) => {
        // Prevents handleContainerClick from firing as well
        e.stopPropagation();

        // Checks if CTRL was being held
        if (e.ctrlKey) {
            if (selectedItems.includes(clickedItem)) {
                // If the clicked item is already in selectedItems, remove it
                setSelectedItems(selectedItems.filter(item => item !== clickedItem));
            } else {
                // If the clicked item is not in selectedItems, add it
                setSelectedItems([clickedItem, ...selectedItems]);
            }
        } else {
            // If CTRL key was not being held
            if (selectedItems.includes(clickedItem)) {
                // If the item is selected, de-select it
                setSelectedItems(selectedItems.filter(item => item !== clickedItem));
            } else {
                // Otherwise, make it editable
                setEditableItem(clickedItem);
            }
        }
        // Returns focus to the input
        inputRef.current.focus();
    }

    const handleCloseClick = () => {
        // If items are selected, delete them
        if (selectedItems.length > 0) {
            deleteAllSelected();
        } else {
            // Otherwise, just clear the input text
            setTextInput("");
        }
    }

    const handleContainerClick = () => {
        // When the container div is clicked, the input is focused, giving the illusion that the whole div is an input
        inputRef.current.focus();

        // Clears the selected items
        setSelectedItems([]);
    }

    // Called on change to the input box
    const handleInputChange = (newInput, overridePending = false) => {
        let processForSplit = true;

        newInput = newInput.trim();

        if (forceLowerCase) {
            newInput = newInput.toLowerCase();
        }

        // If the last character is a comma, set override pending
        if (newInput[newInput.length - 1] === ",") {
            overridePending = true;
        }

        // If the input is unchanged, don't split
        if (!overridePending && newInput === textInput) {
            processForSplit = false;
        }

        // If this item is selected and override pending is not set, don't split
        if (!overridePending && pendingUpdate) {
            processForSplit = false;
        }

        // If not set to auto validate and override pending is not set, don't split
        if (!overridePending && !autoValidate) {
            processForSplit = false;
        }

        // If the item should not be processed to split up emails, update the text input then do nothing else
        if (!processForSplit) {
            setTextInput(newInput);
            return;
        }

        setPendingUpdate(false);

        // Splits on commas
        const entries = newInput.split(new RegExp(separators.join("|")));

        const validItems = [];

        // Finds valid items, and adds them to the validItems array
        // Invalid items are left in remaining input and will stay in the input box
        const remainingInput = entries.flatMap(item => {
            item = item.trim();
            if (validator(item)) {
                // Adds to validItems if this item is not already in the list
                !items.includes(item) && validItems.push(item);
                // Removes from the input
                return [];
            }
            return item;
        });
        if (validItems.length > 0) {
            // Updates the items state provided by the parent
            setItems([...items, ...validItems.filter(item => !items.includes(item))]);
        }
        // Updates the text input removing any saved items
        setTextInput(remainingInput.join(","));
    }

    return (
        <>
            { label &&
                <p
                    className="Label"
                    data-testid="tag-input-label"
                >{ label }</p>
            }
            <div
                className={ `TagInputBox${ className ? ` ${ className }` : "" }` }
                onClick={ e => handleContainerClick(e) }
                data-testid="tag-input-container"
            >
                <div>
                    { items.map((item, idx) => {
                        return (
                            <div
                                key={ idx }
                                onClick={ (e) => handleItemClick(e, item) }
                                className={ `${ selectedItems.includes(item) ? "SelectedItem" : "UnselectedItem" }${ idx === items.length - 1 ? " LastItem" : "" }` }
                                data-testid={ `input-tag-${ idx + 1 }` }
                            >
                                { item }
                            </div>
                        )})}
                    <input
                        type="text"
                        ref={ inputRef }
                        value={ textInput }
                        onKeyUp={ e => handleKeyPress(e) }
                        onChange={ e => handleInputChange(e.target.value) }
                        data-testid="tag-input-box"
                    />
                </div>

                <button
                    onClick={ handleCloseClick }
                    data-testid="tag-clear-icon"
                >
                    x
                </button>
            </div>
        </>
    )
}

TagInputBox.propTypes = {
    className: PropTypes.string,
    items: PropTypes.array.isRequired,
    setItems: PropTypes.func.isRequired,
    validator: PropTypes.func,
    autoValidate: PropTypes.bool,
    label: PropTypes.string,
    separators: PropTypes.array,
    forceLowerCase: PropTypes.bool
}

export default TagInputBox;