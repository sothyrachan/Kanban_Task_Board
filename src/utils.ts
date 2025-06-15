// Helper functions

export function removeSpecialChars(value: string): string {
    return value.trim().replace(/[^A-Za-z0-9\-\s]/g, "");
}

export function generateTaskId(title: string): string {
    return `${removeSpecialChars(title).toLowerCase().split(" ").join("-")}-${Date.now()}`;
}