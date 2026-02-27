export interface TutorialStep {
  /** 0-based step index */
  index: number;
  /** Description text for this step */
  description: string;
  /** 1-based start line in the code (inclusive) */
  lineStart: number;
  /** 1-based end line in the code (inclusive) */
  lineEnd: number;
}

/**
 * Parse a description string into individual steps.
 * Handles numbered list format: "1. text\n2. text\n3. text"
 */
function parseDescriptionSteps(description: string): string[] {
  const lines = description.split("\n").filter((l) => l.trim());

  // Check if numbered format (1. xxx, 2. xxx)
  const numberedPattern = /^\d+\.\s+/;
  const isNumbered = lines.length > 0 && lines.every((l) => numberedPattern.test(l.trim()));

  if (isNumbered) {
    return lines.map((l) => l.trim().replace(numberedPattern, ""));
  }

  // Otherwise just use each non-empty line as a step
  return lines;
}

/**
 * Split code into logical blocks (separated by empty lines).
 * Returns array of { startLine, endLine } (1-based, inclusive).
 */
function splitCodeBlocks(code: string): { startLine: number; endLine: number }[] {
  const lines = code.split("\n");
  const blocks: { startLine: number; endLine: number }[] = [];

  let blockStart: number | null = null;

  for (let i = 0; i < lines.length; i++) {
    const isBlank = lines[i].trim() === "";
    if (!isBlank && blockStart === null) {
      blockStart = i + 1; // 1-based
    }
    if (isBlank && blockStart !== null) {
      blocks.push({ startLine: blockStart, endLine: i }); // i is 0-based, so endLine = i (the line before blank)
      blockStart = null;
    }
  }

  // Last block
  if (blockStart !== null) {
    blocks.push({ startLine: blockStart, endLine: lines.length });
  }

  return blocks;
}

/**
 * Build tutorial steps by mapping description steps to code blocks/lines.
 */
export function buildTutorialSteps(
  code: string,
  description: string
): TutorialStep[] {
  const descSteps = parseDescriptionSteps(description);
  if (descSteps.length === 0) return [];

  const codeLines = code.split("\n");
  const totalLines = codeLines.length;

  if (totalLines === 0) {
    return descSteps.map((desc, i) => ({
      index: i,
      description: desc,
      lineStart: 1,
      lineEnd: 1,
    }));
  }

  const codeBlocks = splitCodeBlocks(code);

  // If we have similar number of blocks as steps, map 1:1
  if (codeBlocks.length === descSteps.length) {
    return descSteps.map((desc, i) => ({
      index: i,
      description: desc,
      lineStart: codeBlocks[i].startLine,
      lineEnd: codeBlocks[i].endLine,
    }));
  }

  // If more blocks than steps, group blocks into steps
  if (codeBlocks.length > descSteps.length) {
    const stepsCount = descSteps.length;
    const blocksPerStep = Math.ceil(codeBlocks.length / stepsCount);

    return descSteps.map((desc, i) => {
      const startBlock = i * blocksPerStep;
      const endBlock = Math.min((i + 1) * blocksPerStep - 1, codeBlocks.length - 1);
      return {
        index: i,
        description: desc,
        lineStart: codeBlocks[startBlock].startLine,
        lineEnd: codeBlocks[endBlock].endLine,
      };
    });
  }

  // If fewer blocks than steps (or no clear blocks), divide lines evenly
  const linesPerStep = Math.max(1, Math.ceil(totalLines / descSteps.length));

  return descSteps.map((desc, i) => {
    const start = i * linesPerStep + 1;
    const end = Math.min((i + 1) * linesPerStep, totalLines);
    return {
      index: i,
      description: desc,
      lineStart: start,
      lineEnd: end,
    };
  });
}
