import { useState } from "react";
import { FaUndo } from 'react-icons/fa';
import { FaRedo } from "react-icons/fa";
import { FaBold } from "react-icons/fa";
import { FaItalic } from "react-icons/fa";
import { FaUnderline } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";


const App = () => {
  const [texts, setTexts] = useState([]);
  const [fontSize,setFontSize]=useState(16);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [selectedTextIndex, setSelectedTextIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

   // Save current state to history
   const saveToHistory = () => {
    setHistory([...history, JSON.parse(JSON.stringify(texts))]); // Save a deep copy
    setRedoStack([]); // Clear redo stack on new changes
  };

  // Undo functionality
  const undo = () => {
    if (history.length === 0) return;

    const newTexts = history[history.length - 1]; // Get the previous state
    setRedoStack([JSON.parse(JSON.stringify(texts)), ...redoStack]); // Save current state to redo stack
    setTexts(newTexts); // Apply the previous state
    setHistory(history.slice(0, -1)); // Remove the last state from history

    // Validate selectedTextIndex
    if (selectedTextIndex !== null && selectedTextIndex >= newTexts.length) {
      setSelectedTextIndex(null);
    }
  };

  // Redo functionality
  const redo = () => {
    if (redoStack.length === 0) return;

    const newTexts = redoStack[0]; // Get the next state
    setHistory([...history, JSON.parse(JSON.stringify(texts))]); // Save current state to history
    setTexts(newTexts); // Apply the next state
    setRedoStack(redoStack.slice(1)); // Remove the first state from redo stack

    // Validate selectedTextIndex
    if (selectedTextIndex !== null && selectedTextIndex >= newTexts.length) {
      setSelectedTextIndex(null);
    }
  };

  // Add new text
  const addText = () => {
    saveToHistory();
    setTexts([
      ...texts,
      {
        content: "Double-click to edit",
        x: 100,
        y: 100,
        fontSize: 16,
        isBold: false,
        isItalic: false,
        isUnderline: false,
        color: "#000000", // Default color
      },
    ]);
  };

  // Update text attributes
  const updateText = (index, key, value) => {
    if (index === null || index >= texts.length) return; // Validate index
    saveToHistory();
    const updatedTexts = [...texts];
    updatedTexts[index][key] = value;
    setTexts(updatedTexts);
  };

  // Handle dragging start
  const handleMouseDown = (e, index) => {
    setSelectedTextIndex(index);
    setIsDragging(true);
  };

  // Handle dragging move
  const handleMouseMove = (e) => {
    if (!isDragging || selectedTextIndex === null) return;

    const updatedTexts = [...texts];
    updatedTexts[selectedTextIndex].x += e.movementX;
    updatedTexts[selectedTextIndex].y += e.movementY;
    setTexts(updatedTexts);
  };

  // Handle dragging end
  const handleMouseUp = () => {
    if (isDragging) saveToHistory(); // Save dragging changes
    setIsDragging(false);
  };

  return (
    <div
      className="h-screen flex flex-col bg-gray-100"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/*Navbar */}

      <div className="flex flex-row border border-black">
        
        <div className="">
        <img src="public\images\celebrare-logo.webp"
        className="h-10 m-2 "
        ></img>
        </div>
         <div className="flex flex-grow items-center justify-center gap-4  pr-32">
         <button
          onClick={undo}
          className={`px-8 py-2 rounded ${
            history.length > 0
              ? "bg-gray-300 hover:bg-gray-400"
              : "bg-gray-200 cursor-not-allowed"
          }`}
          disabled={history.length === 0}
        >
          <FaUndo />
        </button>
        <button
          onClick={redo}
          className={`px-8 py-2 rounded ${
            redoStack.length > 0
              ? "bg-gray-300 hover:bg-gray-400"
              : "bg-gray-200 cursor-not-allowed"
          }`}
          disabled={redoStack.length === 0}
        >
          <FaRedo/>
        </button>
         </div>
      </div>
      
      {/* Canvas */}
      <div className="flex-1 relative bg-gray-100 border">
        {texts.map((text, index) => (
          
          <div
            key={index}
            style={{
              left: `${text.x}px`,
              top: `${text.y}px`,
              fontSize: `${text.fontSize}px`,
              fontWeight: text.isBold ? "bold" : "normal",
              fontStyle: text.isItalic ? "italic" : "normal",
              textDecoration: text.isUnderline ? "underline" : "none",
              color: text.color,
            }}
            className="absolute cursor-move text-gray-800"
            onMouseDown={(e) => handleMouseDown(e, index)}
          >
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) =>
                updateText(index, "content", e.target.innerText)
              }
              className="px-1"
            >
              {text.content}
            </div>
          </div>
        ))}
      </div>
      {/* Toolbar */}
      <div className="flex items-center gap-4 p-4 bg-white shadow-md justify-center">
        <button
          onClick={addText}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Text
        </button>
        
        
        {selectedTextIndex !== null && (
          <>
          <input
              type="color"
              value={texts[selectedTextIndex].color}
              onChange={(e) =>
                updateText(selectedTextIndex, "color", e.target.value)
              }
              className="w-10 h-10 p-1 rounded border border-gray-300"
            />
            <button
              onClick={() =>
                updateText(
                  selectedTextIndex,
                  "fontSize",
                  texts[selectedTextIndex].fontSize - 1,
                  setFontSize(texts[selectedTextIndex].fontSize - 1)

                )
              }
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              <FaMinus/>
            </button>
            <button
              className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded "
  
            >
              {fontSize}
            </button>
            <button
              onClick={() =>
                updateText(
                  selectedTextIndex,
                  "fontSize",
                  texts[selectedTextIndex].fontSize + 1,
                  setFontSize(texts[selectedTextIndex].fontSize - 1)
                )
              }
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              <FaPlus/>
            </button>
            <button
              onClick={() =>
                updateText(
                  selectedTextIndex,
                  "isBold",
                  !texts[selectedTextIndex].isBold
                )
              }
              className={`px-4 py-2 rounded ${
                texts[selectedTextIndex].isBold
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            >
              <FaBold/>
            </button>
            <button
              onClick={() =>
                updateText(
                  selectedTextIndex,
                  "isItalic",
                  !texts[selectedTextIndex].isItalic
                )
              }
              className={`px-4 py-2 rounded ${
                texts[selectedTextIndex].isItalic
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            >
              <FaItalic/>
            </button>
            <button
              onClick={() =>
                updateText(
                  selectedTextIndex,
                  "isUnderline",
                  !texts[selectedTextIndex].isUnderline
                )
              }
              className={`px-4 py-2 rounded ${
                texts[selectedTextIndex].isUnderline
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            >
              <FaUnderline/>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
