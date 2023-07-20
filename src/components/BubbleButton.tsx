import { ComponentProps, ReactNode } from "react";

export interface BubbleButtonProps extends ComponentProps<"button"> {
  children: ReactNode;
}

const BubbleButton = (props: BubbleButtonProps) => {
  return (
    <button
      className="p-2 text-zinc-200 text-sm flex items-center gap-1.5 font-medium leading-none hover:text-zinc-50 data-[active=true]:text-violet-400 hover:bg-zinc-600"
      {...props}
    />
  );
};

export default BubbleButton;
