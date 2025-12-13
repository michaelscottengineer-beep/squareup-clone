import { builderElements, columnLayouts } from "@/data/mailTemplateEditor";

const mailTemplateBuilder = {
  createColumn: (numOfCol: keyof typeof columnLayouts) => ({
    ...columnLayouts[numOfCol],
    id: Math.random(),
  }),
  createElement: (name: keyof typeof builderElements, initData?: any) => {
    return { ...builderElements[name], id: Math.random(), ...initData };
  },
};

export default mailTemplateBuilder;
