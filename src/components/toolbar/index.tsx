import * as React from "react";
import { ToolBarContainer } from "./styled";

const Toolbar = () => {
  return (
    <ToolBarContainer>
      <button className="ql-bold">B</button>
      <button className="ql-italic">I</button>
      <button className="ql-link">Li</button>
      <button className="ql-mention">Me</button>
      <button className="ql-addEmoji">Em</button>
    </ToolBarContainer>
  );
};

export default Toolbar;
