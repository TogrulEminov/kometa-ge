interface ParseJsonProps<T> {
    data: T[];
}

export interface ParsedRoute {
    from: string;
    to: string;
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

export const parseRoute = (input: unknown): ParsedRoute => {
    const emptyRoute: ParsedRoute = { from: "", to: "" };

    if (!input) return emptyRoute;

    if (typeof input === "object" && input !== null && !Array.isArray(input)) {
        const route = input as Partial<ParsedRoute>;
        return {
            from: route.from ?? "",
            to: route.to ?? "",
        };
    }

    if (typeof input === "string") {
        try {
            return parseRoute(JSON.parse(input));
        } catch {
            return emptyRoute;
        }
    }

    return emptyRoute;
};