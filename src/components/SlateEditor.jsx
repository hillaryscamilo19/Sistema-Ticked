import React, { useCallback, useMemo, useState } from "react";
import { createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";

const SlateEditor = () => {
  const editor = useMemo(() => withReact(createEditor()), []);

  const [value, setValue] = useState([
    {
      type: "paragraph",
      children: [{ text: "Escribe algo aquí..." }],
    },
  ]);
  const renderElement = useCallback((props) => {
    return <p {...props.attributes}>{props.children}</p>;
  }, []);

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={(newValue) => setValue(newValue)}
    >
      <Editable
        renderElement={renderElement}
        placeholder="Empieza a escribir..."
        spellCheck
        autoFocus
      />
    </Slate>
  );
};

export default SlateEditor;
