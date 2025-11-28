import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React, { useEffect, useState, type CSSProperties, type FC } from "react";
import { Outlet } from "react-router";
import WebBuilderEditorSidebar from "./WebBuilderEditorSidebar";
import useEditorState from "@/stores/use-editor-state";
import { Button } from "@/components/ui/button";
import {
  DndContext,
  useDraggable,
  useDroppable,
  type DragEndEvent,
} from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import ResizeWrapper from "@/components/ResizeWrapper";
import { Resizable } from "react-resizable";
import '@/styles/resizeable.css'
const WebBuilderEditorLayout = () => {
  return (
    <SidebarProvider className="! min-! max-! " open={false}>
      <WebBuilderEditorSidebar className="fixed  " />
      <SidebarInset>
        <main className="flex-1">
          <div className=" px-10 py-10">
            <div>
              <h1>WebBuilderEditorLayout</h1>
              <SidebarContent />
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

const SidebarContent = () => {
  const html = useEditorState((state) => state.html);
  const update = useEditorState((state) => state.update);

  const Element = ({ json }: { json: (typeof html)[number] }) => {
    const [curData, setCurData] = useState(json);
    const [newTransform, setNewTransform] = useState<any>(null);

    const setActiveId = useEditorState((state) => state.setActiveId);
    const activeId = useEditorState((state) => state.activeId);

    const { setNodeRef, attributes, listeners, transform } = useDraggable({
      attributes: {},

      id: curData.id,
      data: {
        ...curData,
        position: {
          x: (curData.position.x || 0) + (newTransform?.x || 0),
          y: (curData.position.y || 0) + (newTransform?.y || 0),
        },
      },
    });
    const x = (curData.position.x || 0) + (transform?.x || 0);
    const y = (curData.position.y || 0) + (transform?.y || 0);

    const styleTransform = {
      transform: `translate(${x}px, ${y}px)`,
    };

    useEffect(() => {
      if (json) setCurData({ ...json });
    }, [json]);

    useEffect(() => {
      if (transform) setNewTransform({ ...transform });
    }, [transform]);

    switch (curData.type) {
      case "button":
        return (
          <ResizeWrapper
            name={curData.type}
            style={{
              ...styleTransform,
            }}
            isSelected={curData.id === activeId}
            className={cn("")}
          >
            {curData.id === activeId ? (
              <Button
                ref={setNodeRef}
                {...listeners}
                {...attributes}
                style={{
                  ...curData.style,
                }}
              >
                {curData.text}
              </Button>
            ) : (
              <Button
                style={{
                  ...curData.style,
                }}
                onClick={() => setActiveId(curData.id)}
              >
                {curData.text}
              </Button>
            )}
          </ResizeWrapper>
        );

      case "text": 
      return    <ResizeWrapper
            name={curData.type}
            style={{
              ...styleTransform,
            }}
            isSelected={curData.id === activeId}
            className={cn("")}
          >
            {curData.id === activeId ? (
              <p
                ref={setNodeRef}
                {...listeners}
                {...attributes}
                style={{
                  ...curData.style,
                }}
              >
                {curData.text}
              </p>
            ) : (
              <p
                style={{
                  ...curData.style,
                }}
                onClick={() => setActiveId(curData.id)}
              >
                {curData.text}
              </p>
            )}
          </ResizeWrapper>
    }
    return <></>;
  };

  useEffect(() => {
    const handleClick = (e: PointerEvent) => {
    };

    document.body.addEventListener("click", handleClick);

    return () => {
      document.body.removeEventListener("click", handleClick);
    };
  }, []);
  function handleDragEnd(event: DragEndEvent) {
    const { active, over, activatorEvent } = event;
    // if (!over) return;

    const elementId = active.id;
    const elementData = active.data;

    update(elementId as string, elementData.current as any);
  }
  return (
    <DndContext onDragEnd={handleDragEnd}>
      {html.map((json) => {
        return <Element json={json} />;
      })}
      
    </DndContext>
  );
};
export default WebBuilderEditorLayout;
