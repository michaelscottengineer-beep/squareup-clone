import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import QuickAddToCartButton from "./QuickAddToCartButton";
import type { TItem } from "@/types/item";
import CreationCartItemDialog from "./CreationCartItemDialog";
import useNavigateCategory from "@/hooks/use-navigate-category";
import { calcItemPrice } from "@/utils/helper";
import { cn } from "@/lib/utils";

interface CategorySectionProps {
  categoryName: string;
  items: TItem[];
}

const CategorySection = ({ categoryName, items }: CategorySectionProps) => {
  const categoryRef = useRef<HTMLHeadingElement>(null);
  useNavigateCategory("#" + categoryName, categoryRef.current);

  return (
    <section className="mt-4" ref={categoryRef}>
      <h2 className="font-semibold text-xl mb-8">{categoryName}</h2>
      <div className="grid grid-cols-2 gap-8">
        {items.map((item) => {
          return <ItemCard key={item.id} item={item} />;
        })}
      </div>
    </section>
  );
};

interface ItemCardProps {
  item: TItem;
}
const ItemCard = ({ item }: ItemCardProps) => {
  const [isOpenCreation, setIsOpenCreation] = useState(false);

  const discountText =
    item.discount?.unit === "%"
      ? `${item.discount.value}% OFF`
      : `$${item.discount?.value} OFF`;

  return (
    <div key={item.id} className="relative">
      <Button className="group p-0 bg-transparent min-h-[200px] hover:bg-transparent text-black text-start border-border hover:border-black border rounded-lg transition-colors duration-300 grid grid-cols-3 ">
        <div className="info p-3 col-span-2 h-full flex flex-col gap-2">
          <h3 className="capitalize">{item.name}</h3>
          <p className="text-muted-foreground group-hover:text-black font-normal text-pretty transition-colors duration-300">
            {item.description}
          </p>

          <div className="price flex items-center gap-2 font-normal mt-auto text-sm">
            <div
              className={cn("price__original ", {
                "text-muted-foreground":
                  !!item.discount && item.discount.value > 0,
              })}
            >
              ${item.price}
            </div>

            {item.discount && item.discount.value > 0 && (
              <>
                <div className="price__promo">
                  ${calcItemPrice(Number(item.price), 1, item.discount)}
                </div>

                <div className="price__promo__info px-1.5 bg-accent-promo rounded-full text-accent-promo-foreground">
                  {discountText}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="img">
          <img
            src={item.image ? item.image : "/tmp_restaurant_img.jpeg"}
            alt="dish-img"
            className="rounded-md object-cover h-full  aspect-square rounded-tl-none rounded-bl-none"
          />
        </div>
      </Button>

      <CreationCartItemDialog
        item={item}
        isOpen={isOpenCreation}
        onOpenChange={setIsOpenCreation}
        triggerButton={
          <QuickAddToCartButton
            onClickCallback={() => setIsOpenCreation(true)}
          />
        }
      />
    </div>
  );
};

export default CategorySection;
