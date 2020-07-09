// import styled from "styled-components";
import Quill from "quill";

// const BoldElement = styled.b`
//   font-size: 13px;
//   font-weight: bold;
// `;

const Inline = Quill.import("blots/inline");

export class Bold extends Inline {
  static blotName = "bold";
  static tagName = "b";

  static create() {
    return super.create();
  }

  static formats() {
    return true;
  }
}
