interface ParseJsonProps<T> {
    data: T[];
}

export const parseJSON = <T>(input: unknown): ParseJsonProps<T> => {
    if (Array.isArray(input)) {
        return {data: input as T[]};
    }
    if (typeof input === "string") {
        try {
            const parsed: unknown = JSON.parse(input);
            return {
                data: Array.isArray(parsed) ? (parsed as T[]) : []
            };
        } catch {
            return {data: []};
        }
    }
    return {data: []};
};