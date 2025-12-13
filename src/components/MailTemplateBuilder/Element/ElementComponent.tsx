import TextElement from "./TextElement";
import ButtonElement from ".//ButtonElement";
import ImageElement from "./ImageElement";

const ElementComponent = ({ element }: { element: any }) => {
  if (!element) console.log('ude',element)
  switch (element?.type) {
    case "Text":
      return <TextElement element={element} />;

    case "Button":
      return <ButtonElement element={element} />;
    case "Image":
      return <ImageElement element={element} />;

    default:
      return null;
  }
};

export default ElementComponent;
