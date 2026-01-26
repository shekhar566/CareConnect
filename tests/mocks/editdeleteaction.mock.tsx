import React from "react";

const MockEditDeleteAction = ({ type }: { type: string; itemId: string }) => {
  return (
    <div>
      <button>Edit {type}</button>
      <button>Delete {type}</button>
    </div>
  );
};

export { MockEditDeleteAction };
