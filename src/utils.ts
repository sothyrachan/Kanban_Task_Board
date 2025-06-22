// utils.ts

// ====== Helper Functions ======

/**
 * Removes special characters from a string, keeping letters, numbers, dashes, and spaces.
 */
export function removeSpecialChars(value: string): string {
    return value.trim().replace(/[^A-Za-z0-9\-\s]/g, "");
}

/**
 * Generates a unique task ID based on the sanitized title and current timestamp.
 */
export function generateTaskId(title: string): string {
    const slug = removeSpecialChars(title)
        .toLowerCase()
        .split(" ")
        .join("-");
    return `${slug}-${Date.now()}`;
}