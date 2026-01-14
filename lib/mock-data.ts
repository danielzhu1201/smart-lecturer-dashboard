export const mockBlueprint = {
  sections: [
    {
      title: "Introduction to Machine Learning",
      subsections: [
        { title: "Course Overview", timestamp: "0:00" },
        { title: "What is Machine Learning?", timestamp: "2:15" },
        { title: "Types of Learning", timestamp: "5:30" },
      ],
    },
    {
      title: "Supervised Learning Fundamentals",
      subsections: [
        { title: "Regression Problems", timestamp: "8:45" },
        { title: "Classification Problems", timestamp: "12:20" },
        { title: "Training and Test Data", timestamp: "16:10" },
      ],
    },
    {
      title: "Linear Regression",
      subsections: [
        { title: "Cost Function", timestamp: "19:30" },
        { title: "Gradient Descent", timestamp: "23:45" },
        { title: "Feature Scaling", timestamp: "28:15" },
      ],
    },
    {
      title: "Neural Networks Introduction",
      subsections: [
        { title: "Perceptrons", timestamp: "32:00" },
        { title: "Activation Functions", timestamp: "35:40" },
        { title: "Backpropagation", timestamp: "39:20" },
      ],
    },
  ],
}

export const mockFlashcards = [
  {
    question: "What is the primary goal of supervised learning?",
    answer: "To learn a mapping function from input variables to output variables using labeled training data.",
  },
  {
    question: "What is the difference between regression and classification?",
    answer:
      "Regression predicts continuous numerical values, while classification predicts discrete categorical labels.",
  },
  {
    question: "What is gradient descent?",
    answer:
      "An optimization algorithm that iteratively adjusts parameters to minimize the cost function by moving in the direction of steepest descent.",
  },
  {
    question: "Why is feature scaling important?",
    answer:
      "Feature scaling ensures all features contribute equally to the model and helps gradient descent converge faster by preventing one feature from dominating.",
  },
  {
    question: "What is the purpose of an activation function in neural networks?",
    answer:
      "Activation functions introduce non-linearity into the network, allowing it to learn complex patterns and relationships in the data.",
  },
]

export const mockKnowledgeGraph = {
  nodes: [
    {
      id: "1",
      type: "input",
      data: { label: "Machine Learning" },
      position: { x: 250, y: 0 },
      style: {
        background: "hsl(var(--primary))",
        color: "hsl(var(--primary-foreground))",
        border: "2px solid hsl(var(--primary))",
        borderRadius: "8px",
        padding: "10px",
        fontWeight: "bold",
      },
    },
    {
      id: "2",
      data: { label: "Supervised Learning" },
      position: { x: 100, y: 100 },
      style: {
        background: "hsl(var(--card))",
        border: "2px solid hsl(var(--border))",
        borderRadius: "8px",
        padding: "10px",
      },
    },
    {
      id: "3",
      data: { label: "Unsupervised Learning" },
      position: { x: 400, y: 100 },
      style: {
        background: "hsl(var(--card))",
        border: "2px solid hsl(var(--border))",
        borderRadius: "8px",
        padding: "10px",
      },
    },
    {
      id: "4",
      data: { label: "Regression" },
      position: { x: 0, y: 200 },
      style: {
        background: "hsl(var(--accent))",
        color: "hsl(var(--accent-foreground))",
        border: "2px solid hsl(var(--accent))",
        borderRadius: "8px",
        padding: "10px",
      },
    },
    {
      id: "5",
      data: { label: "Classification" },
      position: { x: 150, y: 200 },
      style: {
        background: "hsl(var(--accent))",
        color: "hsl(var(--accent-foreground))",
        border: "2px solid hsl(var(--accent))",
        borderRadius: "8px",
        padding: "10px",
      },
    },
    {
      id: "6",
      data: { label: "Neural Networks" },
      position: { x: 300, y: 200 },
      style: {
        background: "hsl(var(--card))",
        border: "2px solid hsl(var(--border))",
        borderRadius: "8px",
        padding: "10px",
      },
    },
    {
      id: "7",
      data: { label: "Linear Regression" },
      position: { x: 0, y: 300 },
      style: {
        background: "hsl(var(--muted))",
        border: "1px solid hsl(var(--border))",
        borderRadius: "6px",
        padding: "8px",
        fontSize: "12px",
      },
    },
    {
      id: "8",
      data: { label: "Gradient Descent" },
      position: { x: 150, y: 300 },
      style: {
        background: "hsl(var(--muted))",
        border: "1px solid hsl(var(--border))",
        borderRadius: "6px",
        padding: "8px",
        fontSize: "12px",
      },
    },
    {
      id: "9",
      data: { label: "Backpropagation" },
      position: { x: 300, y: 300 },
      style: {
        background: "hsl(var(--muted))",
        border: "1px solid hsl(var(--border))",
        borderRadius: "6px",
        padding: "8px",
        fontSize: "12px",
      },
    },
  ],
  edges: [
    { id: "e1-2", source: "1", target: "2", animated: true, style: { stroke: "hsl(var(--primary))" } },
    { id: "e1-3", source: "1", target: "3", animated: true, style: { stroke: "hsl(var(--primary))" } },
    { id: "e2-4", source: "2", target: "4", style: { stroke: "hsl(var(--muted-foreground))" } },
    { id: "e2-5", source: "2", target: "5", style: { stroke: "hsl(var(--muted-foreground))" } },
    { id: "e2-6", source: "2", target: "6", style: { stroke: "hsl(var(--muted-foreground))" } },
    { id: "e4-7", source: "4", target: "7", style: { stroke: "hsl(var(--border))" } },
    { id: "e4-8", source: "4", target: "8", style: { stroke: "hsl(var(--border))" } },
    { id: "e6-9", source: "6", target: "9", style: { stroke: "hsl(var(--border))" } },
  ],
}
