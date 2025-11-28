import DropdownMenuTest from "@/pages/experiments/DropdownMenuTest";
import A from "@/pages/experiments/test-use-state/A";
import TestUploadImage from "@/pages/experiments/TestUploadImage";
import PhoCharleston from "@/pages/web-builder/templates/PhoCharleston";
import TemplateLayout from "@/pages/web-builder/templates/TemplateLayout";
import TemplateEditor from "@/pages/web-builder/user-editor/TemplateEditor";
import WebBuilderEditorLayout from "@/pages/web-builder/web-build-editor/WebBuilderEditorLayout";
import WebsiteEditor from "@/pages/website/WebsiteEditor";
import WebSitePage from "@/pages/website/WebSitePage";
import type { RouteObject } from "react-router";

const experimentRoute: RouteObject[] = [
  { path: "/test/img", element: <TestUploadImage /> },
  { path: "/test/state", element: <A /> },
  { path: "/test/dropdown-menu", element: <DropdownMenuTest /> },
];

export default experimentRoute;
