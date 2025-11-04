import { useEffect } from "react";
import { useLocation } from "react-router";

export default function useNavigateCategory(
  hashTarget: string,
  element: HTMLElement | null
) {
  const location = useLocation();

  useEffect(() => {
    if (!element) return;

    const currentHash = decodeURIComponent(location.hash);

    if (hashTarget === currentHash) {
      console.log("navigate category", currentHash, hashTarget);
      element?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'end'
      });
    }

    return () => {
    }
  }, [location.hash, element, hashTarget]);
}
