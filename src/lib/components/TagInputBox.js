import "./styles.css";
import PropTypes from "prop-types";
import { useRef, useState } from "react";
import { regexEsc } from "../utils";

const TagInputBox = ({ className, items, setItems, validator, label, labelPosition, separators, forceLowerCase }) => {
    const [textInput, setTextInput] = useState("");
    const [selectedItems, setSelectedItems] = useState([]);
    const [inputLock, setInputLock] = useState(false);

    const splitterRegex = new RegExp(separators.map(char => regexEsc(char)).join("|"));

    const inputRef = useRef(null);

    // Deletes all selected items
    const deleteAllSelected = () => {
        setItems(items.filter(item => !selectedItems.includes(item)));
        setSelectedItems([]);
    }

    // Called on key down on the input box
    const handleKeyPress = e => {
        const key = e.key;

        if (key === "Backspace") {
            // If backspace is clicked and there is no input
            if (textInput === "") {
                if (e.ctrlKey) {
                    // If CTRL is being held, remove the selected items
                    // If CTRL is being held, remove the selected items
                    if (selectedItems.length > 0) {
                        // If items are selected, delete all the selected items
                        deleteAllSelected();
                    } else {
                        // If no items are selected, delete the last item
                        setItems(items.slice(0, items.length - 1));
                    }

                } else {
                    if (items.length > 0) {
                        // If CTRL is not being held, make the last item editable
                        setEditableItem(items[items.length - 1]);
                        setInputLock(true);
                    }
                }
            }
        } else if (key === "Enter") {
            // If enter is clicked, remove the pending update to "override" it and save the item
            handleInputChange(textInput, true);
        } else if (key === "Delete" && textInput === "") {
            // If delete is clicked and there is no input, remove the selected items
            deleteAllSelected();
        }
    }

    // Makes the specified item available for editing by moving it into the input box
    const setEditableItem = value => {
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
    const handleInputChange = (newInput, forceProcess = false) => {
        // If input lock is set, clear it and do nothing
        if (inputLock) {
            setInputLock(false);
            return;
        }

        if (forceLowerCase) {
            newInput = newInput.toLowerCase();
        }

        let processForSplit = forceProcess;

        // If forceProcess is not set, proceed to check conditions for processing the input
        if (!processForSplit) {
            // If the last character is a separator, we should process the input
            if (separators.includes(newInput.trim()[newInput.length - 1])) {
                processForSplit = true;
            }
        }

        // If the item should not be processed, update the text input state then do nothing else
        if (!processForSplit) {
            setTextInput(newInput);
            return;
        }

        // Splits on the separators
        const entries = newInput.split(splitterRegex).filter(item => item !== "");

        const validItems = [];

        // Finds valid items, and adds them to the validItems array
        // Invalid items are left in remaining input and will stay in the input box
        const remainingInput = entries.flatMap(item => {
            if (validator(item.trim())) {
                // Adds to validItems if this item is not already in the list
                !items.includes(item) && validItems.push(item.trim());
                // Removes from the input
                return [];
            }
            return item;
        });
        if (validItems.length > 0) {
            // Updates the items state provided by the parent
            setItems([...items, ...validItems]);
        }
        // Updates the text input removing any saved items
        setTextInput(remainingInput.join(","));
    }

    if (!items || !setItems) return "";

    return (
        <div className={ `TIB_Container ${ className }${ labelPosition === "bottom" ? " TIB_Container_Reverse" : "" }` }>
            { typeof(label) !== "undefined" &&
                <p
                    className="TIB_Label"
                    data-testid="tag-input-label"
                >
                    { label }
                </p>
            }
            <div
                className="TIB_InputContainer"
                onClick={ e => handleContainerClick(e) }
                data-testid="tag-input-container"
            >
                <div>
                    { items.map((item, idx) => {
                        return (
                            <div
                                key={ idx }
                                onClick={ (e) => handleItemClick(e, item) }
                                className={ `TIB_Tag ${ selectedItems.includes(item) ? "TIB_SelectedItem" : "TIB_UnselectedItem" }${ idx === items.length - 1 ? " TIB_LastItem" : "" }` }
                                data-testid={ `input-tag-${ idx + 1 }` }
                            >
                                { item }
                            </div>
                        )})}
                    <input
                        type="text"
                        ref={ inputRef }
                        value={ textInput }
                        onKeyDown={ e => handleKeyPress(e) }
                        onChange={ e => handleInputChange(e.target.value) }
                        data-testid="tag-input-box"
                    />
                </div>

                <button
                    onClick={ handleCloseClick }
                    data-testid="tag-clear-icon"
                    className="TIB_XButton"
                >
                    x
                </button>
            </div>
        </div>
    )
}

TagInputBox.defaultProps = {
    className: "",
    validator: () => true,
    label: undefined,
    labelPosition: "bottom",
    separators: [","],
    forceLowerCase: false
}

TagInputBox.propTypes = {
    className: PropTypes.string,
    items: PropTypes.array.isRequired,
    setItems: PropTypes.func.isRequired,
    validator: PropTypes.func,
    label: PropTypes.string,
    labelPosition: PropTypes.oneOf(["top", "bottom"]),
    separators: PropTypes.array,
    forceLowerCase: PropTypes.bool
}

export default TagInputBox;