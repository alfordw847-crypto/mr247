import React from "react";
import Navigation from "./dashboard/components/navigation";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
      <Navigation />
    </div>
  );
}
