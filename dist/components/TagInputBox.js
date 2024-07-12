"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
require("./styles.css");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _react = require("react");
var _utils = require("../utils");
var _jsxRuntime = require("react/jsx-runtime");
var TagInputBox = function TagInputBox(_ref) {
  var className = _ref.className,
    items = _ref.items,
    setItems = _ref.setItems,
    validator = _ref.validator,
    label = _ref.label,
    labelPosition = _ref.labelPosition,
    separators = _ref.separators,
    forceLowerCase = _ref.forceLowerCase;
  var _useState = (0, _react.useState)(""),
    _useState2 = (0, _slicedToArray2.default)(_useState, 2),
    textInput = _useState2[0],
    setTextInput = _useState2[1];
  var _useState3 = (0, _react.useState)([]),
    _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
    selectedItems = _useState4[0],
    setSelectedItems = _useState4[1];
  var _useState5 = (0, _react.useState)(false),
    _useState6 = (0, _slicedToArray2.default)(_useState5, 2),
    inputLock = _useState6[0],
    setInputLock = _useState6[1];
  var inputRef = (0, _react.useRef)(null);
  var splitterRegex = new RegExp(separators.map(function (char) {
    return (0, _utils.regexEsc)(char);
  }).join("|"));

  // Deletes all selected items
  var deleteAllSelected = function deleteAllSelected() {
    setItems(items.filter(function (item) {
      return !selectedItems.includes(item);
    }));
    setSelectedItems([]);
  };

  // Called on key down on the input box
  var handleKeyPress = /*#__PURE__*/function () {
    var _ref2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(e) {
      var key, clipboardText;
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            key = e.key;
            if (!(key === "Backspace")) {
              _context.next = 5;
              break;
            }
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
              } else if (items.length > 0) {
                // If CTRL is not being held, make the last item editable
                setEditableItem(items[items.length - 1]);
                setInputLock(true);
              }
            }
            _context.next = 34;
            break;
          case 5:
            if (!(key === "Enter")) {
              _context.next = 9;
              break;
            }
            // If enter is pressed, remove the pending update to "override" it and save the item
            handleInputChange(textInput, true);
            _context.next = 34;
            break;
          case 9:
            if (!(key === "Delete" && textInput === "")) {
              _context.next = 13;
              break;
            }
            // If delete is pressed and there is no input, remove the selected items
            deleteAllSelected();
            _context.next = 34;
            break;
          case 13:
            if (!(textInput === "")) {
              _context.next = 34;
              break;
            }
            if (!(key.toLowerCase() === "a" && e.ctrlKey)) {
              _context.next = 18;
              break;
            }
            // If CTRL+A is pressed, select all the items
            setSelectedItems(items);
            _context.next = 34;
            break;
          case 18:
            if (!(key.toLowerCase() === "c" && e.ctrlKey)) {
              _context.next = 23;
              break;
            }
            _context.next = 21;
            return navigator.clipboard.writeText(selectedItems.join(","));
          case 21:
            _context.next = 34;
            break;
          case 23:
            if (!(key.toLowerCase() === "x" && e.ctrlKey)) {
              _context.next = 29;
              break;
            }
            _context.next = 26;
            return navigator.clipboard.writeText(selectedItems.join(","));
          case 26:
            deleteAllSelected();
            _context.next = 34;
            break;
          case 29:
            if (!(key.toLowerCase() === "v" && e.ctrlKey)) {
              _context.next = 34;
              break;
            }
            _context.next = 32;
            return navigator.clipboard.readText();
          case 32:
            clipboardText = _context.sent;
            handleInputChange(clipboardText, true);
          case 34:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function handleKeyPress(_x) {
      return _ref2.apply(this, arguments);
    };
  }();

  // Makes the specified item available for editing by moving it into the input box
  var setEditableItem = function setEditableItem(value, tempItems) {
    tempItems = tempItems || items;
    // Sets the input box to this item
    setTextInput(value);

    // Removes this item from the items list
    setItems(tempItems.filter(function (item) {
      return item !== value;
    }));

    // Removes this item from the selected items
    setSelectedItems(selectedItems.filter(function (item) {
      return item !== value;
    }));
  };

  // Handles the action to take when an item is clicked
  var handleItemClick = function handleItemClick(e, clickedItem) {
    // Prevents handleContainerClick from firing as well
    e.stopPropagation();

    // Checks if CTRL was being held
    if (e.ctrlKey) {
      if (selectedItems.includes(clickedItem)) {
        // If the clicked item is already in selectedItems, remove it
        setSelectedItems(selectedItems.filter(function (item) {
          return item !== clickedItem;
        }));
      } else {
        // If the clicked item is not in selectedItems, add it
        setSelectedItems([clickedItem].concat((0, _toConsumableArray2.default)(selectedItems)));
      }
    } else {
      // If CTRL key was not being held
      if (selectedItems.includes(clickedItem)) {
        // If the item is selected, de-select it
        setSelectedItems(selectedItems.filter(function (item) {
          return item !== clickedItem;
        }));
      } else {
        // Otherwise, try to submit the current text, then make the selected item editable
        var tempItems = handleInputChange("".concat(textInput), true);
        setEditableItem(clickedItem, tempItems);
      }
    }
    // Returns focus to the input
    inputRef.current.focus();
  };
  var handleCloseClick = function handleCloseClick() {
    // If items are selected, delete them
    if (selectedItems.length > 0) {
      deleteAllSelected();
    } else {
      // Otherwise, just clear the input text
      setTextInput("");
    }
  };
  var handleContainerClick = function handleContainerClick() {
    // When the container div is clicked, the input is focused, giving the illusion that the whole div is an input
    inputRef.current.focus();

    // Clears the selected items
    setSelectedItems([]);
  };

  // Called on change to the input box
  var handleInputChange = function handleInputChange(newInput) {
    var forceProcess = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    // If input lock is set, clear it and do nothing
    if (inputLock) {
      setInputLock(false);
      return;
    }
    if (forceLowerCase) {
      newInput = newInput.toLowerCase();
    }
    var processForSplit = forceProcess;

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
    var entries = newInput.split(splitterRegex).filter(function (item) {
      return item !== "";
    });
    var newItems = (0, _toConsumableArray2.default)(items);

    // Finds valid items, and adds them to the validItems array
    // Invalid items are left in remaining input and will stay in the input box
    var remainingInput = entries.flatMap(function (item) {
      if (validator(item.trim())) {
        // Adds to validItems if this item is not already in the list
        !items.includes(item) && newItems.push(item.trim());
        // Removes from the input
        return [];
      }
      return item;
    });
    // Updates the items state provided by the parent
    setItems(newItems);

    // Updates the text input removing any saved items
    setTextInput(remainingInput.join(","));
    return newItems;
  };
  if (!items || !setItems) return "";
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    className: "TIB_Container".concat(className ? " ".concat(className) : "").concat(labelPosition === "bottom" ? " TIB_Container_Reverse" : ""),
    children: [typeof label !== "undefined" && /*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
      className: "TIB_Label",
      "data-testid": "tag-input-label",
      children: label
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: "TIB_InputContainer",
      onClick: function onClick(e) {
        return handleContainerClick(e);
      },
      onKeyDown: function onKeyDown(e) {
        return handleKeyPress(e);
      },
      "data-testid": "tag-input-container",
      children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        children: [items.map(function (item, idx) {
          return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
            onClick: function onClick(e) {
              return handleItemClick(e, item);
            },
            className: "TIB_Tag ".concat(selectedItems.includes(item) ? "TIB_SelectedItem" : "TIB_UnselectedItem").concat(idx === items.length - 1 ? " TIB_LastItem" : ""),
            "data-testid": "input-tag-".concat(idx + 1),
            children: item
          }, idx);
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
          type: "text",
          ref: inputRef,
          value: textInput,
          onKeyDown: function onKeyDown(e) {
            return handleKeyPress(e);
          },
          onChange: function onChange(e) {
            return handleInputChange(e.target.value);
          },
          "data-testid": "tag-input-box"
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
        onClick: handleCloseClick,
        "data-testid": "tag-clear-icon",
        className: "TIB_XButton",
        children: "x"
      })]
    })]
  });
};
TagInputBox.defaultProps = {
  className: "",
  validator: function validator() {
    return true;
  },
  label: undefined,
  labelPosition: "bottom",
  separators: [","],
  forceLowerCase: false
};
TagInputBox.propTypes = {
  className: _propTypes.default.string,
  items: _propTypes.default.array.isRequired,
  setItems: _propTypes.default.func.isRequired,
  validator: _propTypes.default.func,
  label: _propTypes.default.string,
  labelPosition: _propTypes.default.oneOf(["top", "bottom"]),
  separators: _propTypes.default.array,
  forceLowerCase: _propTypes.default.bool
};
var _default = exports.default = TagInputBox;