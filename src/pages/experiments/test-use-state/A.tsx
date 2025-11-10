import { Button } from "@/components/ui/button";
import React, { useState } from "react";

const A = () => {
  const [count, setCount] = useState(0);

  console.log("re-render A: ", count);
  return (
    <div>
      A<Button onClick={(e) => setCount(count + 1)}>A count {count}</Button>
      <B parent={count} />
    </div>
  );
};

const B = ({ parent }: { parent: number }) => {
  const [count, setCount] = useState(0);

  console.log("re-render B: ", count);
  console.log("re-render B with parent count: ", parent);
  return (
    <div>
      B <Button onClick={(e) => setCount(count + 1)}>B count {count}</Button>
      <C parent={count} />
    </div>
  );
};

const C = ({ parent }: { parent: number }) => {
  const [count, setCount] = useState(parent);

  console.log("re-render C: ", count);
    console.log("re-render C with parent count: ", parent);
  return (
    <div>
      C <Button onClick={(e) => setCount(count + 1)}>C count {count}</Button>
    </div>
  );
};
export default A;
