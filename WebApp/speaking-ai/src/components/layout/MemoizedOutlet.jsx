import React, { memo } from "react";
import { Outlet } from "react-router-dom";

const MemoizedOutlet = memo(
  ({ context }) => <Outlet context={context} />,
  (prevProps, nextProps) => {
    return prevProps.context === nextProps.context;
  }
);

export default MemoizedOutlet;
