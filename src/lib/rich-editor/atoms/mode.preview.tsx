import  { useState } from "react";
import { Modal, Divider, Empty } from "antd";
import { useEditorState, type Editor } from "@tiptap/react";
import { LuEye } from "react-icons/lu";
import ToolbarButton from "./toolbar"; 

interface Props {
  editor: Editor;
}

export default function PreviewBtn({ editor }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  // useEditorState vasitəsilə editorun daxili HTML-ini reaktiv şəkildə götürürük
  const { htmlContent } = useEditorState({
    editor,
    selector: (ctx) => ({
      htmlContent: ctx.editor.getHTML(),
    }),
  });

  if (!editor) return null;

  // Boş kontent yoxlaması (Tiptap boş olanda adətən '<p></p>' qaytarır)
  const isEmpty = !htmlContent || htmlContent === "<p></p>";

  return (
    <>
      <ToolbarButton 
        title="Sənədə Önizləmə" 
        onClick={() => setIsOpen(true)} 
        isActive={isOpen}
      >
        <LuEye size={18} />
      </ToolbarButton>

      <Modal
        title={
          <div className="flex items-center gap-2 text-slate-700">
            <LuEye className="text-sky-500" />
            <span className="text-[15px] font-bold uppercase tracking-tight">
              Sənəd Önizləməsi
            </span>
          </div>
        }
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        footer={null}
        width={1000}
        centered
        destroyOnHidden
        // Ant Design 5.x üçün body styles
        styles={{ 
          body: { 
            maxHeight: "75vh", 
            overflowY: "auto", 
            padding: "30px 0",
            backgroundColor: "#fff" 
          } 
        }}
      >
        <Divider style={{ margin: "10px 0 25px 0" }} />

        {isEmpty ? (
          <div className="py-20">
            <Empty description="Göstəriləcək məzmun yoxdur" />
          </div>
        ) : (
       
          <article 
            className="tiptap preview-render"
            dangerouslySetInnerHTML={{ __html: htmlContent  }} 
          />
        )}
      </Modal>
    </>
  );
}