import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Blueprint } from "@/types/lecture-navigator";
import { type Node, type Edge, Position } from "reactflow";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Layout Configuration ---
const NODE_WIDTH = 250; // Assumed width of your node cards
const NODE_HEIGHT = 80; // Assumed height of your node cards
const X_GAP = 400; // Horizontal space between columns (Root -> Section -> Sub)
const Y_GAP = 30; // Vertical space between stacked nodes

// --- Node Styling ---
// We intentionally use inline styles so we can keep ReactFlow default nodes
// (no custom node components / nodeTypes) while still making them look like
// professional cards.
const baseNodeStyle: React.CSSProperties = {
  width: NODE_WIDTH,
  minHeight: NODE_HEIGHT,
  borderRadius: 14,
  padding: "12px 14px",
  display: "flex",
  alignItems: "center",
  boxSizing: "border-box",
  fontSize: 13,
  lineHeight: 1.25,
  letterSpacing: "-0.01em",
  boxShadow: "0 1px 2px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.08)",
};

const rootNodeStyle: React.CSSProperties = {
  ...baseNodeStyle,
  background: "linear-gradient(135deg, #0f172a 0%, #1f2937 60%, #111827 100%)",
  color: "#ffffff",
  border: "1px solid rgba(255,255,255,0.12)",
  fontWeight: 700,
  fontSize: 14,
};

const sectionNodeStyle: React.CSSProperties = {
  ...baseNodeStyle,
  background: "#ffffff",
  color: "#0f172a",
  border: "1px solid rgba(15, 23, 42, 0.10)",
  fontWeight: 600,
};

const subsectionNodeStyle: React.CSSProperties = {
  ...baseNodeStyle,
  background: "rgba(248, 250, 252, 0.95)",
  color: "#0f172a",
  border: "1px solid rgba(15, 23, 42, 0.08)",
  fontWeight: 500,
};

const baseEdgeStyle: Edge["style"] = {
  stroke: "rgba(100, 116, 139, 0.85)", // slate-500-ish
  strokeWidth: 1.6,
};

export function createKnowledgeMapGraph(
  title: string,
  blueprint: Blueprint
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // 1. Calculate the total vertical space required
  // We sum up the "leaf nodes" (subsections) to determine the overall canvas height
  let totalLeafNodes = 0;
  blueprint.sections.forEach((section) => {
    // If a section has 0 children, it still takes up 1 row of space
    totalLeafNodes += Math.max(section.subsections.length, 1);
  });

  const totalGraphHeight = totalLeafNodes * (NODE_HEIGHT + Y_GAP);

  // 2. Create the Root Node
  // Position it at X=0, and vertically centered relative to the whole tree
  const rootId = "root";
  nodes.push({
    id: rootId,
    type: "root", // Preserving your custom node type
    data: { label: title },
    // Center the root vertically
    position: { x: 0, y: totalGraphHeight / 2 - NODE_HEIGHT / 2 },
    sourcePosition: Position.Right, // Edges leave from the right
    style: rootNodeStyle,
  });

  // 3. Process Sections and Subsections
  let currentY = 0; // Tracks the vertical cursor as we move down the canvas

  blueprint.sections.forEach((section, si) => {
    const sectionId = `section-${si}`;
    const subsectionCount = Math.max(section.subsections.length, 1);

    // Calculate the total height this specific section block occupies
    const sectionBlockHeight = subsectionCount * (NODE_HEIGHT + Y_GAP);

    // --- Create Section Node (Level 1) ---
    // Position: X = 1 column over. Y = Center of this specific block.
    const sectionY = currentY + sectionBlockHeight / 2 - NODE_HEIGHT / 2;

    nodes.push({
      id: sectionId,
      type: "section", // Preserving your custom node type
      data: { label: section.title },
      position: { x: X_GAP, y: sectionY },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      style: sectionNodeStyle,
    });

    edges.push({
      id: `e-${rootId}-${sectionId}`,
      source: rootId,
      target: sectionId,
      type: "smoothstep", // 90-degree lines look cleaner for trees
      animated: true,
      style: baseEdgeStyle,
    });

    // --- Create Subsection Nodes (Level 2) ---
    section.subsections.forEach((sub, subi) => {
      const subId = `${sectionId}-sub-${subi}`;

      // Position: X = 2 columns over. Y = Stacked sequentially.
      const subY = currentY + subi * (NODE_HEIGHT + Y_GAP);

      nodes.push({
        id: subId,
        type: "subsection", // Preserving your custom node type
        data: { label: sub.title, timestamp: sub.timestamp },
        position: { x: X_GAP * 2, y: subY },
        targetPosition: Position.Left,
        style: subsectionNodeStyle,
      });

      edges.push({
        id: `e-${sectionId}-${subId}`,
        source: sectionId,
        target: subId,
        type: "smoothstep",
        style: baseEdgeStyle,
      });
    });

    // Move the cursor down by the height of the block we just finished
    currentY += sectionBlockHeight;
  });

  return { nodes, edges };
}
