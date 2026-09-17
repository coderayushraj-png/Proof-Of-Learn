const fs = require('fs');

let content = fs.readFileSync('src/pages/workspace/TaskTab.tsx', 'utf8');

content = content.replace(
  "const [code, setCode] = useState(task.initialCode || \"\")",
  "const [code, setCode] = useState(task?.initialCode || \"\")"
);

content = content.replace(
  "setCode(task.initialCode || \"\")",
  "setCode(task?.initialCode || \"\")"
);

content = content.replace(
  "setTestResults(null)\n    setHintLevel(0)\n    setExpandedConcept(null)\n  }, [task.id])",
  "setTestResults(null)\n    setHintLevel(0)\n    setExpandedConcept(null)\n  }, [task?.id])"
);

content = content.replace(
  "task.title",
  "task?.title"
);

content = content.replace(
  "task.objective",
  "task?.objective"
);

content = content.replace(
  "task.why",
  "task?.why"
);

content = content.replace(
  "task.requirements",
  "task?.requirements"
);

content = content.replace(
  "task.criteria",
  "task?.criteria"
);

content = content.replace(
  "task.concepts",
  "task?.concepts"
);

content = content.replace(
  "task.hints",
  "task?.hints"
);

fs.writeFileSync('src/pages/workspace/TaskTab.tsx', content);

