import React, { useState, useEffect } from "react";
import {
  Editor,
  EditorState,
  Modifier,
  convertToRaw,
  convertFromRaw,
  RichUtils,
} from "draft-js";
import "draft-js/dist/Draft.css";

const customStyleMap = {
  BOLD: {
    fontWeight: "bold",
    fontSize: "16px",
    fontFamily: "Jersey 15, sans-serif",
  },
  RED: {
    color: "red",
    fontSize: "16px",
    fontFamily: "Jersey 15, sans-serif",
  },
  UNDERLINE: {
    textDecoration: "underline",
    fontSize: "16px",
    fontFamily: "Jersey 15, sans-serif",
    color: "#333",
  },
  HEADER: {
    fontSize: "24px",
    fontWeight: "bold",
    fontFamily: "Jersey 15, sans-serif",
    color: "#333",
  },
};

const App = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  useEffect(() => {
    const savedContent = localStorage.getItem("editorContent");
    if (savedContent) {
      const contentState = convertFromRaw(JSON.parse(savedContent));
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, []);

  const handleChange = (state) => {
    let contentState = state.getCurrentContent();
    const selectionState = state.getSelection();
    const blockKey = selectionState.getStartKey();
    const block = contentState.getBlockForKey(blockKey);
    const text = block.getText();

    // Handle header (#)
    if (text.startsWith("# ") && selectionState.getAnchorOffset() === 2) {
      contentState = Modifier.replaceText(
        contentState,
        selectionState.merge({
          anchorOffset: 0,
          focusOffset: 2,
        }),
        ""
      );
      const newState = EditorState.push(state, contentState, "change-block-type");
      setEditorState(RichUtils.toggleBlockType(newState, "header-one"));
      return;
    }

    // Handle bold (*)
    if (text.startsWith("* ") && selectionState.getAnchorOffset() === 2) {
      contentState = Modifier.replaceText(
        contentState,
        selectionState.merge({
          anchorOffset: 0,
          focusOffset: 2,
        }),
        ""
      );
      let newState = EditorState.push(state, contentState, "change-inline-style");
      // Toggle bold style
      newState = RichUtils.toggleInlineStyle(newState, "BOLD");
      setEditorState(newState);
      return;
    }

    // Handle red (**) 
    if (text.startsWith("** ") && selectionState.getAnchorOffset() === 3) {
      contentState = Modifier.replaceText(
        contentState,
        selectionState.merge({
          anchorOffset: 0,
          focusOffset: 3,
        }),
        ""
      );
      let newState = EditorState.push(state, contentState, "change-inline-style");
      // Toggle red style
      newState = RichUtils.toggleInlineStyle(newState, "RED");
      setEditorState(newState);
      return;
    }

    // Handle underline (***)
    if (text.startsWith("*** ") && selectionState.getAnchorOffset() === 4) {
      contentState = Modifier.replaceText(
        contentState,
        selectionState.merge({
          anchorOffset: 0,
          focusOffset: 4,
        }),
        ""
      );
      let newState = EditorState.push(state, contentState, "change-inline-style");
      // Toggle underline style
      newState = RichUtils.toggleInlineStyle(newState, "UNDERLINE");
      setEditorState(newState);
      return;
    }

    setEditorState(state); // Update state when no special formatting is detected
  };

  const handleSave = () => {
    const contentState = editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    localStorage.setItem("editorContent", JSON.stringify(rawContent));
    alert("Content saved!");

    // Reset the cursor to the end of the content
    const newEditorState = EditorState.moveFocusToEnd(editorState);
    setEditorState(newEditorState);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ margin: 0, fontFamily: "Jersey 15, sans-serif" }}>React Sorcerer Editor</h1>
        <button
          onClick={handleSave}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Save
        </button>
      </div>
      <div
        style={{
          border: "1px solid #ccc",
          minHeight: "300px",
          padding: "10px",
          cursor: "text",
          marginTop: "20px",
          fontFamily: "Jersey 15, sans-serif",
        }}
        onClick={() =>
          document.querySelector(".public-DraftEditor-content").focus()
        }
      >
        <Editor
          editorState={editorState}
          onChange={handleChange}
          placeholder="For heading: # + Space | For bold: * + Space | For red text: ** + Space | For underline: *** + Space"
          customStyleMap={customStyleMap}
        />
      </div>
    </div>
  );
};
export default App;
