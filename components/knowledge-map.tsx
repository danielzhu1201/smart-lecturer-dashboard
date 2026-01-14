"use client"
import ReactFlow, { MiniMap, Controls, Background, useNodesState, useEdgesState, BackgroundVariant } from "reactflow"
import "reactflow/dist/style.css"
import { mockKnowledgeGraph } from "@/lib/mock-data"

export function KnowledgeMap() {
  const [nodes, , onNodesChange] = useNodesState(mockKnowledgeGraph.nodes)
  const [edges, , onEdgesChange] = useEdgesState(mockKnowledgeGraph.edges)

  return (
    <div className="h-[500px] w-full border rounded-lg overflow-hidden bg-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        className="bg-background"
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  )
}
