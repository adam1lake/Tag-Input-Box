"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("./styles.css");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _react = require("react");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var TagInputBox = function TagInputBox(_ref) {
  var className = _ref.className,
    items = _ref.items,
    setItems = _ref.setItems,
    validator = _ref.validator,
    autoValidate = _ref.autoValidate,
    label = _ref.label,
    separators = _ref.separators,
    forceLowerCase = _ref.forceLowerCase;
  var _useState = (0, _react.useState)(""),
    _useState2 = _slicedToArray(_useState, 2),
    textInput = _useState2[0],
    setTextInput = _useState2[1];
  var _useState3 = (0, _react.useState)([]),
    _useState4 = _slicedToArray(_useState3, 2),
    selectedItems = _useState4[0],
    setSelectedItems = _useState4[1];
  var _useState5 = (0, _react.useState)(false),
    _useState6 = _slicedToArray(_useState5, 2),
    pendingUpdate = _useState6[0],
    setPendingUpdate = _useState6[1];

  // If no validator is provided, set it as a function that always returns true
  if (typeof validator === "undefined") {
    validator = function validator() {
      return true;
    };
  }

  // If no separators are provided, the default is a comma
  separators = separators || [","];
  forceLowerCase = forceLowerCase || false;
  var inputRef = (0, _react.useRef)(null);

  // Deletes all selected items
  var deleteAllSelected = function deleteAllSelected() {
    setItems(items.filter(function (item) {
      return !selectedItems.includes(item);
    }));
    setSelectedItems([]);
  };

  // Called on keyup on the input box
  var handleKeyPress = function handleKeyPress(e) {
    var key = e.key;
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
  };

  // Makes the specified item available for editing by moving it into the input box
  var setEditableItem = function setEditableItem(value) {
    // Sets the item to be pending update
    setPendingUpdate(true);

    // Sets the input box to this item
    setTextInput(value);

    // Removes this item from the items list
    setItems(items.filter(function (item) {
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
        setSelectedItems([clickedItem].concat(_toConsumableArray(selectedItems)));
      }
    } else {
      // If CTRL key was not being held
      if (selectedItems.includes(clickedItem)) {
        // If the item is selected, de-select it
        setSelectedItems(selectedItems.filter(function (item) {
          return item !== clickedItem;
        }));
      } else {
        // Otherwise, make it editable
        setEditableItem(clickedItem);
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
    var overridePending = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var processForSplit = true;
    if (forceLowerCase) {
      newInput = newInput.toLowerCase();
    }

    // If the last character is a comma, set override pending
    if (newInput.trim()[newInput.length - 1] === ",") {
      overridePending = true;
    }

    // If the input is unchanged, don't split
    if (!overridePending && newInput.trim() === textInput) {
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
    var entries = newInput.split(new RegExp(separators.join("|")));
    var validItems = [];

    // Finds valid items, and adds them to the validItems array
    // Invalid items are left in remaining input and will stay in the input box
    var remainingInput = entries.flatMap(function (item) {
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
      setItems([].concat(_toConsumableArray(items), _toConsumableArray(validItems.filter(function (item) {
        return !items.includes(item);
      }))));
    }
    // Updates the text input removing any saved items
    setTextInput(remainingInput.join(","));
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, label && /*#__PURE__*/React.createElement("p", {
    className: "Label",
    "data-testid": "tag-input-label"
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "TagInputBox".concat(className ? " ".concat(className) : ""),
    onClick: function onClick(e) {
      return handleContainerClick(e);
    },
    "data-testid": "tag-input-container"
  }, /*#__PURE__*/React.createElement("div", null, items.map(function (item, idx) {
    return /*#__PURE__*/React.createElement("div", {
      key: idx,
      onClick: function onClick(e) {
        return handleItemClick(e, item);
      },
      className: "".concat(selectedItems.includes(item) ? "SelectedItem" : "UnselectedItem").concat(idx === items.length - 1 ? " LastItem" : ""),
      "data-testid": "input-tag-".concat(idx + 1)
    }, item);
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    ref: inputRef,
    value: textInput,
    onKeyUp: function onKeyUp(e) {
      return handleKeyPress(e);
    },
    onChange: function onChange(e) {
      return handleInputChange(e.target.value);
    },
    "data-testid": "tag-input-box"
  })), /*#__PURE__*/React.createElement("button", {
    onClick: handleCloseClick,
    "data-testid": "tag-clear-icon"
  }, "x")));
};
TagInputBox.propTypes = {
  className: _propTypes.default.string,
  items: _propTypes.default.array.isRequired,
  setItems: _propTypes.default.func.isRequired,
  validator: _propTypes.default.func,
  autoValidate: _propTypes.default.bool,
  label: _propTypes.default.string,
  separators: _propTypes.default.array,
  forceLowerCase: _propTypes.default.bool
};
var _default = exports.default = TagInputBox;