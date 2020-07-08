import * as React from "react";
import Quill from "quill";
import { createPortal } from "react-dom";
import { v4 } from "uuid";

const BlockEmbed = Quill.import("blots/block/embed");

const DATA_ID_KEY = "data-id";

const FileCell = React.forwardRef<
  { getData: () => any },
  {
    readOnly: boolean;
    type: string;
    node: {
      src: string;
    };
  }
>(({ node }, ref) => {
  const getData = React.useCallback(() => node, [node]);

  React.useImperativeHandle(ref, () => ({
    getData,
  }));
  if (!node.src) return null;
  console.log(">>>>> render test", node);
  return <img width="100%" height="100%" src={node.src} alt="" />;
});

export default class FileCellBlot extends BlockEmbed {
  static blotName = "fileCell";
  static tagName = "figure";
  static className = "ql-custom";
  static ref = {};

  static create(value: any) {
    const id = v4();
    const node = super.create(value);
    node.setAttribute(DATA_ID_KEY, id);
    FileCellBlot.data = value;
    FileCellBlot.refs = {
      ...FileCellBlot.refs,
      [id]: React.createRef(),
    };
    return node;
  }

  static value(domNode: Element) {
    const id = domNode.getAttribute(DATA_ID_KEY);
    if (id) {
      const ref = FileCellBlot.refs[id];
      return (ref && ref.current && ref.current.getData()) || id;
    }
    return undefined;
  }

  constructor(domNode: Element) {
    super(domNode);
    this.id = domNode.getAttribute(DATA_ID_KEY);
    this.data = FileCellBlot.data;
  }

  public attach() {
    super.attach();
    this.scroll.emitter.emit("blot-mount", this);
  }

  public detach() {
    super.detach();
    this.scroll.emitter.emit("blot-unmount", this);
  }

  public renderPortal(id: string) {
    const { options } = Quill.find(this.scroll.domNode.parentNode);
    const ref = FileCellBlot.refs[id];
    return createPortal(
      <FileCell
        ref={ref}
        type={FileCellBlot.blotName}
        node={this.data}
        readOnly={options.readOnly}
      />,
      this.domNode
    );
  }
}
