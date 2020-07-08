import * as React from "react";
import Quill from "quill";
// import QuillEditor, { Quill } from "react-quill";
import defer from "lodash/defer";
import map from "lodash/map";
import { FileCellBlot } from "./components/blots";

import "quill/dist/quill.snow.css";

Quill.register(
  {
    "formats/fileCell": FileCellBlot,
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
        formats: ["fileCell"],
        modules: {
          history: {
            delay: 1000,
            maxStack: 500,
            userOnly: true,
          },
          // toolbar: [],
        },
      });
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
        {/* <QuillEditor
          ref={this.refEditor}
          readOnly={false}
          placeholder="여기에 텍스트를 입력하세요"
          formats={["fileCell"]}
          modules={{
            history: {
              delay: 1000,
              maxStack: 500,
              userOnly: true,
            },
            // toolbar: [],
          }}
          value={this.state.value}
          onChange={this.handleChange}
        /> */}

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

  private readonly handleChange = (text: string) => {
    this.setState({
      value: text,
    });
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
}
