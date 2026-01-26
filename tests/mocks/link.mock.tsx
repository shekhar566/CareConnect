import React, { ReactNode } from "react";

const MockLink = ({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) => {
  return <a href={href}>{children}</a>;
};

export { MockLink };
