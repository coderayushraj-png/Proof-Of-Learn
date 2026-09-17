for file in src/components/layout/Navbar.tsx src/pages/Explore.tsx src/pages/Workspace.tsx src/pages/workspace/ResourcesTab.tsx src/pages/workspace/SubmissionTab.tsx; do
  if ! grep -q "import React" "$file"; then
    sed -i '1s/^/import React from "react";\n/' "$file"
  fi
done
