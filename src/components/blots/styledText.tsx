import styled from "styled-components";
import Quill from "quill";

const BoldElement = styled.b`
  font-size: 13px;
  font-weight: bold;
`;

const ItalicElement = styled.i`
  font-size: 13px;
  font-style: italic;
`;

const Inline = Quill.import("blots/inline");

export class Bold extends Inline {
  static blotName = "bold";
  static tagName = "b";
  static className = BoldElement;

  static create() {
    return super.create();
  }

  static formats() {
    return true;
  }
}

export class Italic extends Inline {
  static blotName = "italic";
  static tagName = "i";
  static className = ItalicElement;

  static create() {
    return super.create();
  }

  static formats() {
    return true;
  }
}
