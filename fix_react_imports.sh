for file in src/components/ProtectedRoute.tsx src/pages/ForgotPassword.tsx src/pages/Login.tsx src/pages/SignUp.tsx; do
  if ! grep -q "import React" "$file"; then
    sed -i '1s/^/import React from "react";\n/' "$file"
  fi
done
