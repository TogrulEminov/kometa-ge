import {type Editor, useEditorState} from "@tiptap/react";
import {RxLineHeight} from "react-icons/rx";
import ButtonsDropdown from "./dropdown";
import {lineheight_key} from "../data/constant";

export interface Props {
    editor: Editor
}

const LINE_HEIGHTS = [
    {label: "Sıx",       value: "1"},
    {label: "Normal",    value: "1.5"},
    {label: "Geniş",     value: "2.0"},
    {label: "Çox geniş", value: "4.0"},
] as const;

const itemClass = `w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-sky-50 hover:text-sky-700 transition-colors duration-200 cursor-pointer first:rounded-t-md last:rounded-b-md flex items-center justify-between gap-4`;

export default function LineheightButton({editor}: Props) {
    const {activeHeight} = useEditorState({
        editor,
        selector: ctx => ({
            activeHeight: ctx.editor.getAttributes('textStyle').lineHeight ?? null,
        }),
    });

    const isAnyActive = LINE_HEIGHTS.some(h => h.value === activeHeight);

    return (
        <ButtonsDropdown
            stateKey={lineheight_key}
            element={
                <button
                    type="button"
                    title="Sətir aralığı"
                    className={`cursor-pointer w-9 h-9 flex items-center justify-center rounded-md transition-all duration-300
                        ${isAnyActive
                        ? 'bg-sky-200 text-sky-700'
                        : 'text-slate-500 hover:bg-slate-100'}`}
                >
                    <RxLineHeight size={18}/>
                </button>
            }
        >
            <div className="flex flex-col min-w-40">
                {LINE_HEIGHTS.map(({label, value}) => (
                    <button
                        key={value}
                        type="button"
                        className={`${itemClass} ${activeHeight === value ? 'bg-sky-50 text-sky-700' : ''}`}
                        onClick={() => editor.chain().focus().toggleTextStyle({lineHeight: value}).run()}
                    >
                        <span>{label}</span>
                        <span className="text-xs text-slate-400">{value}</span>
                    </button>
                ))}

                <button
                    type="button"
                    className={`${itemClass} border-t border-slate-100 text-rose-400 hover:bg-rose-50 hover:text-rose-600`}
                    onClick={() => editor.chain().focus().unsetLineHeight().run()}
                >
                    Sıfırla
                </button>
            </div>
        </ButtonsDropdown>
    );
}