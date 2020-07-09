import * as React from "react";
import Quill, { RangeStatic, StringMap } from "quill";
import defer from "lodash/defer";
import map from "lodash/map";
import "quill/dist/quill.snow.css";

import { FileCellBlot, Bold } from "./components/blots";
import Toolbar from "./components/toolbar";

Quill.register(
  {
    "formats/fileCell": FileCellBlot,
    "formats/bold": Bold,
  },
  true
);

interface IProps {}

interface IState {
  embedBlots: { [key: string]: any };
  value: string;
}

export default class App extends React.Component<IProps, IState> {
  public state: IState = {
    embedBlots: {},
    value: "",
  };
  private editor: Quill | null = null;
  private readonly refEditor = React.createRef<HTMLDivElement>();

  public componentDidMount() {
    if (this.refEditor.current) {
      this.editor = new Quill(this.refEditor.current, {
        readOnly: false,
        placeholder: "여기에 텍스트를 입력하세요",
        formats: [
          "fileCell",
          "bold",
          "italic",
          "codeBlock",
          "inlineBlock",
          "link",
        ],
        modules: {
          history: {
            delay: 1000,
            maxStack: 500,
            userOnly: true,
          },
          toolbar: {
            container: "#toolbar",
            handlers: {
              bold: this.handleBoldToolbar,
              addEmoji: this.addEmoji,
            },
          },
          keyboard: {
            bindings: {
              bold: {
                key: "B",
                shortKey: true,
                handler: this.handleBold,
              },
            },
          },
        },
      });
      // this.editor.setContents([
      //   {
      //     insert: "hello",
      //     attributes: { bold: true },
      //   },
      // ] as any);
      this.editor.on("editor-change", this.handleEditorChange);

      const editor = this.editor;

      let blots: any[] = [];
      if (editor) {
        (editor.scroll as any).emitter.on("blot-mount", (blot: any) => {
          blots.push(blot);
          defer(() => {
            if (blots.length > 0) {
              this.onMount(...blots);
              blots = [];
            }
          });
        });
        (editor.scroll as any).emitter.on("blot-unmount", this.onUnMount);
      }
    }
  }

  public render() {
    return (
      <>
        <div ref={this.refEditor}>
          {map(this.state.embedBlots, (blot: any) =>
            blot.renderPortal(blot.id)
          )}
        </div>
        <Toolbar />
        <button onClick={this.handleAddFileCell}>Add Image</button>
      </>
    );
  }

  private readonly onMount = (...blots: any[]) => {
    const embeds = blots.reduce(
      (memo, blot) => {
        memo[blot.id] = blot;
        return memo;
      },
      { ...this.state.embedBlots }
    );
    this.setState({
      embedBlots: embeds,
    });
  };

  private readonly onUnMount = (unmountedBlot: any) => {
    const { [unmountedBlot.id]: blot, ...embedBlots } = this.state.embedBlots;
    this.setState({
      embedBlots,
    });
  };

  private readonly handleEditorChange = (
    eventName: "text-change" | "selection-change",
    delta: any
  ) => {
    if (eventName === "text-change") {
      if (!this.editor) return;

      console.log(">>>>>>", this.editor.getContents());
    }
  };

  private readonly handleAddFileCell = () => {
    const editor = this.editor;
    if (editor) {
      const range = editor.getSelection(true);
      const type = "fileCell";
      const data = {
        src:
          "https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png",
      };
      /** Call pollFormat */
      editor.insertEmbed(range.index, type, data);
      // console.log(">>>>>", editor.getContents());
    }
  };

  private readonly handleBoldToolbar = () => {
    const selection = this.editor?.getSelection(true);
    const currentFormat = selection
      ? this.editor?.getFormat(selection).bold
      : false;
    this.editor?.format("bold", !currentFormat, "user");
  };

  private readonly handleBold = (_range: RangeStatic, context: StringMap) => {
    this.editor?.format("bold", !context.format["bold"], "user");
  };

  private readonly addEmoji = () => {
    if (this.editor) {
      const range = this.editor.getSelection(true);
      this.editor.insertText(range.index, ":EMOJI:");
      const next = range.index + ":EMOJI:".length;
      this.editor.setSelection(next, 0);
    }
  };
}
