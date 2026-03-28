"use client";

import {
  MDXEditor,
  MDXEditorMethods,
  UndoRedo,
  BoldItalicUnderlineToggles,
  toolbarPlugin,
  headingsPlugin,
  listsPlugin,
  linkPlugin,
  quotePlugin,
  markdownShortcutPlugin,
  ListsToggle,
  linkDialogPlugin,
  CreateLink,
  InsertImage,
  InsertTable,
  tablePlugin,
  imagePlugin,
  Separator,
  InsertThematicBreak,
  diffSourcePlugin,
  BlockTypeSelect,
} from "@mdxeditor/editor";
import { useTheme } from "next-themes";
import { Ref } from "react";

import "@mdxeditor/editor/style.css";
import "./dark-editor.css";

interface Props {
  value: string;
  editorRef: Ref<MDXEditorMethods> | null;
  fieldChange: (value: string) => void;
}

const Editor = ({ value, editorRef, fieldChange }: Props) => {
  const { resolvedTheme } = useTheme();

  return (
    <MDXEditor
      key={resolvedTheme}
      markdown={value}
      ref={editorRef}
      onChange={fieldChange}
      className="background-light800_dark200 light-border-2 markdown-editor dark-editor grid w-full overflow-hidden rounded-md border"
      placeholder="Type your clinical findings, patient history, or vitals here..."
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        markdownShortcutPlugin(),

        imagePlugin(),
        tablePlugin(),

        linkPlugin(),
        linkDialogPlugin(),

        diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: "" }),

        toolbarPlugin({
          toolbarContents: () => (
            <>
              <UndoRedo />
              <Separator />
              <BlockTypeSelect /> {/* Replaces CodeToggle with Headings */}
              <Separator />
              <BoldItalicUnderlineToggles />
              <Separator />
              <ListsToggle />
              <Separator />
              <CreateLink />
              <InsertImage />
              <Separator />
              <InsertTable />
              <InsertThematicBreak />
            </>
          ),
        }),
      ]}
    />
  );
};

export default Editor;
