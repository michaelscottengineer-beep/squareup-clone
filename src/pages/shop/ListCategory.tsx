import { cn } from "@/lib/utils";
import type { TCategory, TCategoryV2 } from "@/types/category";
import React from "react";
import { Link, useLocation } from "react-router";


interface ListCategoryProps {
  categories: TCategoryV2[]
}


const ListCategory = ({categories}: ListCategoryProps) => {
  const location = useLocation();

  return (
    <div className="gap-6 flex items-center shop-container">
      {categories.map((cate) => {
        const hash = decodeURIComponent(location.hash);
        const isActive = hash
          ? hash === `#${cate.basicInfo.name}`
          : cate.basicInfo.name === categories[0].basicInfo.name;

        return (
          <Link
            to={`#${cate.basicInfo.name}`}
            key={cate.basicInfo.name}
            className={cn(
              "border-b-2 pb-1 border-b-transparent text-muted-foreground font-medium",
              {
                "border-b-primary font-semibold text-primary": isActive,
              }
            )}
          >
            {cate.basicInfo.name}
          </Link>
        );
      })}
    </div>
  );
};

export default ListCategory;
