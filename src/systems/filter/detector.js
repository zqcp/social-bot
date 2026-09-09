// =========================
// FILTER DETECTOR
// =========================

const CONFUSABLES = {
    // Cyrillic
    "а": "a",
    "А": "a",
    "е": "e",
    "Е": "e",
    "о": "o",
    "О": "o",
    "р": "p",
    "Р": "p",
    "с": "c",
    "С": "c",
    "х": "x",
    "Х": "x",
    "у": "y",
    "У": "y",
    "і": "i",
    "І": "i",
    "ј": "j",
    "Ј": "j",
    "к": "k",
    "К": "k",
    "м": "m",
    "М": "m",
    "т": "t",
    "Т": "t",
    "в": "b",
    "В": "b",
    "н": "h",
    "Н": "h",

    // Greek
    "Α": "a",
    "α": "a",
    "Β": "b",
    "β": "b",
    "Ε": "e",
    "ε": "e",
    "Ι": "i",
    "ι": "i",
    "Κ": "k",
    "κ": "k",
    "Μ": "m",
    "μ": "m",
    "Ν": "n",
    "ν": "n",
    "Ο": "o",
    "ο": "o",
    "Ρ": "p",
    "ρ": "p",
    "Τ": "t",
    "τ": "t",
    "Χ": "x",
    "χ": "x",
    "Υ": "y",
    "υ": "y",

    // Full-width
    "０": "0",
    "１": "1",
    "２": "2",
    "３": "3",
    "４": "4",
    "５": "5",
    "６": "6",
    "７": "7",
    "８": "8",
    "９": "9"
};

const LEETSPEAK = {
    "0": "o",
    "1": "i",
    "2": "z",
    "3": "e",
    "4": "a",
    "5": "s",
    "6": "g",
    "7": "t",
    "8": "b",
    "9": "g",
    "@": "a",
    "$": "s",
    "!": "i",
    "|": "i",
    "+": "t"
};

// =========================
// CHARACTER NORMALIZATION
// =========================

function normalizeCharacters(text) {

    return String(text || "")
        .normalize("NFKC")
        .split("")
        .map(character =>
            CONFUSABLES[character] ||
            character
        )
        .join("")
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(
            /[\u0000-\u001F\u007F-\u009F\u00AD\u034F\u061C\u115F\u1160\u17B4\u17B5\u180B-\u180D\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\u3164\uFE00-\uFE0F\uFEFF]/g,
            ""
        );
}

// =========================
// LEETSPEAK
// =========================

function normalizeLeetspeak(text) {

    return String(text || "")
        .split("")
        .map(character =>
            LEETSPEAK[character] ||
            character
        )
        .join("");
}

// =========================
// REMOVE REPEATS
// =========================

function removeRepeatedCharacters(text) {

    return String(text || "")
        .replace(
            /([a-z0-9])\1{2,}/gi,
            "$1"
        );
}

// =========================
// NORMALIZED TEXT
// =========================

function normalizeText(text) {

    let value =
        normalizeCharacters(text);

    value =
        normalizeLeetspeak(value);

    value =
        removeRepeatedCharacters(value);

    return value
        .replace(/[^a-z0-9]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

// =========================
// COMPACT TEXT
// =========================

function compactText(text) {

    return normalizeText(text)
        .replace(/[^a-z0-9]/g, "");
}

// =========================
// RAW OBFUSCATED TEXT
// =========================

function normalizeForObfuscation(text) {

    let value =
        normalizeCharacters(text);

    value =
        normalizeLeetspeak(value);

    return value;
}

// =========================
// BUILD OBFUSCATED REGEX
// =========================

function buildObfuscatedRegex(word) {

    const compactWord =
        compactText(word);

    if (!compactWord) {
        return null;
    }

    const characters =
        compactWord.split("");

    const pattern =
        characters
            .map(character =>
                character.replace(
                    /[.*+?^${}()|[\]\\]/g,
                    "\\$&"
                )
            )
            .join("[^a-z0-9]*");

    return new RegExp(
        `(?:^|[^a-z0-9])${pattern}(?:$|[^a-z0-9])`,
        "i"
    );
}

// =========================
// MATCH
// =========================

function matchesBlockedWord(
    text,
    blockedWord
) {

    if (
        !text ||
        !blockedWord
    ) {
        return false;
    }

    const normalizedText =
        normalizeText(text);

    const normalizedWord =
        normalizeText(blockedWord);

    if (
        !normalizedText ||
        !normalizedWord
    ) {
        return false;
    }

    // =========================
    // NORMAL MATCH
    // =========================

    const escapedWord =
        normalizedWord.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );

    const normalRegex =
        new RegExp(
            `(?:^|\\s)${escapedWord}(?:$|\\s)`,
            "i"
        );

    if (
        normalRegex.test(
            normalizedText
        )
    ) {
        return true;
    }

    // =========================
    // OBFUSCATED MATCH
    // =========================

    const obfuscatedRegex =
        buildObfuscatedRegex(
            blockedWord
        );

    if (!obfuscatedRegex) {
        return false;
    }

    const obfuscatedText =
        normalizeForObfuscation(text);

    if (
        obfuscatedRegex.test(
            obfuscatedText
        )
    ) {
        return true;
    }

    // =========================
    // COMPACT MATCH
    // =========================

    const compactWordValue =
        compactText(blockedWord);

    const compactInput =
        compactText(text);

    if (
        compactWordValue &&
        compactInput === compactWordValue
    ) {
        return true;
    }

    return false;
}

// =========================
// FIND MATCH
// =========================

function findBlockedWord(
    text,
    words
) {

    if (
        !text ||
        !Array.isArray(words) ||
        !words.length
    ) {
        return null;
    }

    for (const word of words) {

        if (
            typeof word !== "string" ||
            !word.trim()
        ) {
            continue;
        }

        if (
            matchesBlockedWord(
                text,
                word
            )
        ) {
            return word;
        }
    }

    return null;
}

// =========================
// EXPORTS
// =========================

module.exports = {
    normalizeText,
    matchesBlockedWord,
    findBlockedWord
};
