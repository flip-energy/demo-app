import React, { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
};

const Card = ({ children }: CardProps) => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-[350px] text-sm">
      <div className="flex flex-col p-4 space-y-3">{children}</div>
    </div>
  );
};

export default Card;
