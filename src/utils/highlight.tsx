interface PropsType {
    text?: string | undefined,
    activeWord?: string,
    activeWordClassName?: string
}

export const highlightActiveWord = ({text, activeWordClassName, activeWord}: PropsType) => {
    if (!text) return
    if (!activeWord) return text;

    const lowerText = text.toLowerCase();
    const lowerActiveWord = activeWord.toLowerCase();
    const startIndex = lowerText.indexOf(lowerActiveWord);

    if (startIndex === -1) return text;

    const beforeActive = text.slice(0, startIndex);
    const activeText = text.slice(startIndex, startIndex + activeWord.length);
    const afterActive = text.slice(startIndex + activeWord.length);

    return (
        <>
            {beforeActive}
            <span className={activeWordClassName}>{activeText}</span>
            {afterActive}
        </>
    );
};