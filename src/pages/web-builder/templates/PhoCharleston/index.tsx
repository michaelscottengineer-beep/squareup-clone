import "@/styles/phoCharlestonTemplate.css";

import { Separator } from "@/components/ui/separator";
import React from "react";

const PhoCharleston = () => {
  const headerData = usePhoCharlestonEditor((state) => state.header);

  return (
    <div
      className="relative"
      style={{
        ...headerData.elements.general.style,
      }}
    >
      <div className=" template-phoCharleston header phoCharlestonContainer mx-auto flex flex-col gap-3 py-4">
        <div>Logo</div>
        <Separator />
        <div className="nav flex justify-center px-4">
          <NavigationMenuDemo />
        </div>
      </div>
      <SettingOverlay settingContent={<HeaderSettingContent />} />
    </div>
  );
};

import { useIsMobile } from "@/hooks/use-mobile";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link, useLocation } from "react-router";
import SettingOverlay from "../components/SettingOverlay";
import HeaderSettingContent from "./components/HeaderSettingContent";
import usePhoCharlestonEditor from "@/stores/template-editor/usePhoCharlestonEditor";

export function NavigationMenuDemo() {
  const isMobile = useIsMobile();
  const nav = usePhoCharlestonEditor((state) => state.header.elements.nav);

  const location = useLocation();
  const pathname = location.pathname;

  return (
    <NavigationMenu viewport={isMobile}>
      <NavigationMenuList className="flex-wrap">
        {nav.data?.items.map((item: { label: string; href: string }) => {
          return (
            <NavigationMenuItem key={item.href}>
              <ListItem
                to={item.href}
                title={item.label}
                className={`hover:text-[${nav.style?.activeColor}]`}
                style={{
                  color: pathname.endsWith(item.href)
                    ? nav.style?.color
                    : "inherit",
                }}
              ></ListItem>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({
  title,
  children,
  to,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { to: string }) {
  const nav = usePhoCharlestonEditor((state) => state.header.elements.nav);

  return (
    <li {...props}>
      <NavigationMenuLink
        asChild
        className={`hover:text-[${nav.style?.activeColor}] hover:bg-transparent uppercase`}
      >
        <Link to={to}>
          <div className="text-sm leading-none font-medium">{title}</div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

export default PhoCharleston;
