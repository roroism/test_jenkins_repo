// Bug: https://github.com/Microsoft/TypeScript-React-Starter/issues/12

declare module '*.jpg' {
    const fileName: string;
    export = fileName;
}

declare module '*.jpeg' {
    const fileName: string;
    export = fileName;
}

declare module '*.png' {
    const fileName: string;
    export = fileName;
}

declare module '*.PNG' {
    const fileName: string;
    export = fileName;
}

declare module '*.gif' {
    const fileName: string;
    export = fileName;
}

declare module '*.svg' {
    const fileName: string;
    export = fileName;
}
