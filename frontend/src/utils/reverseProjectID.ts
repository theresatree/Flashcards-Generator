export function reverseProjectIDDate(projectId: string) {
    if (projectId.length !== 14) {
        throw new Error("Invalid project ID format");
    }

    const year = projectId.slice(0, 4);
    const month = projectId.slice(4, 6);
    const day = projectId.slice(6, 8);

    return `${day}/${month}/${year}`;
}

export function reverseProjectIDTime(projectId: string) {
    if (projectId.length !== 14) {
        throw new Error("Invalid project ID format");
    }

    const hour = projectId.slice(8, 10);
    const minute = projectId.slice(10, 12);
    const second = projectId.slice(12, 14);

    return `${hour}:${minute}:${second}`;
}


