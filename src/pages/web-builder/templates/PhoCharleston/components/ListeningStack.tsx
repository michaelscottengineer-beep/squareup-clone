import usePhoCharlestonEditor from "@/stores/template-editor/usePhoCharlestonEditor";
import React, { useEffect } from "react";

const ListeningStack = () => {
  const stackUndo = usePhoCharlestonEditor((state) => state.stackUndo);
  const stackRedo = usePhoCharlestonEditor((state) => state.stackRedo);
  const addStack = usePhoCharlestonEditor((state) => state.addStack);
  const removeStack = usePhoCharlestonEditor((state) => state.removeStack);
  const setAllData = usePhoCharlestonEditor((state) => state.setAllData);

  const header = usePhoCharlestonEditor((state) => state.header);
  const footer = usePhoCharlestonEditor((state) => state.footer);
  const sections = usePhoCharlestonEditor((state) => state.sections);

  useEffect(() => {
    const data = {
      header,
      footer,
      sections,
    };

    if (stackUndo.length === 0) {
      addStack({ header, footer, sections }, "undo");
    } else {
      const lastData = stackUndo[stackUndo.length - 1];

      const sortedLastData = Object.keys(lastData)
        .sort()
        .reduce((acc, key) => {
          acc[key] = lastData[key as keyof typeof lastData];
          return acc;
        }, {} as any);
      const sortedData = Object.keys(data)
        .sort()
        .reduce((acc, key) => {
          acc[key] = data[key as keyof typeof data];
          return acc;
        }, {} as any);

      const jsonLast = JSON.stringify(sortedLastData);

      const json = JSON.stringify(sortedData);
      if (jsonLast !== json) {
        addStack({ header, footer, sections }, "undo");
      }
    }
  }, [header, footer, sections]);

  useEffect(() => {
    const handleUndo = () => {
      if (stackUndo.length === 0) return;
      console.log("undo");
      const lastData = stackUndo[stackUndo.length - 1];
      addStack(lastData, "redo");
      removeStack("undo");
      if (stackUndo.length - 1 > 0) setAllData(stackUndo[stackUndo.length - 2]);
    };

    const handleRedo = () => {
      console.log("redo");
      if (stackRedo.length === 0) return;
      const lastData = stackRedo[stackRedo.length - 1];
      addStack(lastData, "undo");
      removeStack("redo");
      setAllData(lastData);
    };

    const handleKeydown = (e: KeyboardEvent) => {
      const ctrlKey = e.ctrlKey;
      const zKey = e.key === "z";
      const yKey = e.key === "y";
      if (ctrlKey && zKey && !yKey) handleUndo();
      if (ctrlKey && yKey && !zKey) handleRedo();
    };
    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [stackUndo, stackRedo]);

  return null;
};

export default ListeningStack;
