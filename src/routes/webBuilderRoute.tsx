import PhoCharleston from "@/pages/web-builder/templates/PhoCharleston";
import TemplateLayout from "@/pages/web-builder/templates/TemplateLayout";
import TemplateEditor from "@/pages/web-builder/user-editor/TemplateEditor";
import WebBuilderEditorLayout from "@/pages/web-builder/web-build-editor/WebBuilderEditorLayout";
import WebsiteEditor from "@/pages/website/WebsiteEditor";
import WebSitePage from "@/pages/website/WebSitePage";
import type { RouteObject } from "react-router";

const webBuilderRouter: RouteObject[] = [
  {
    path: "/websites/:websiteId",
    element: <WebSitePage />,
  },
  {
    path: "/websites/:websiteId/editor",
    element: <WebsiteEditor />,
  },
  {
    path: "/web-builder/editor",
    element: <WebBuilderEditorLayout />,
  },
  {
    path: "/web-builder/templates",
    element: <TemplateLayout />,
  },
  {
    path: "/web-builder/templates/pho-charleston",
    element: <PhoCharleston />,
  },
  {
    path: "/web-builder/templates/:templateId/editor",
    element: <TemplateEditor />,
  },
];

export default webBuilderRouter;
