import { Project, TestRun, TestResult, ProjectTest, TestCategory } from "../types"

/**
 * Mock Evaluation Engine
 * Simulates a backend evaluation service that runs tests against student code.
 */
export const evaluationService = {
  
  /**
   * Run tests for a specific project
   */
  async runTests(project: Project, completedTaskIds: string[]): Promise<TestRun> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const projectTests = project.tests || [];
    
    const results: TestResult[] = projectTests.map(test => {
      const passed = test.taskId ? completedTaskIds.includes(test.taskId) : false;
      
      let received = passed ? test.expected : "Check failed.";
      let errorMsg = "";
      
      if (!passed) {
        if (test.expected.includes("200")) {
          received = "HTTP 404 Not Found";
          errorMsg = "Endpoint does not exist or is not returning 200.";
        } else if (test.category === "Security") {
          received = "API Key found in bundle";
          errorMsg = "You exposed process.env.GEMINI_API_KEY to the client.";
        } else {
          received = "Implementation missing or incorrect";
        }
      }
      
      return {
        testId: test.id,
        passed,
        received,
        errorMsg: passed ? undefined : errorMsg
      }
    });
    
    const passedCount = results.filter(r => r.passed).length;
    
    return {
      id: "run-" + Date.now(),
      timestamp: Date.now(),
      results,
      passedCount,
      totalCount: projectTests.length
    }
  },
  
  /**
   * Check if a submission is valid
   */
  validateSubmission(githubUrl: string, demoUrl?: string): { valid: boolean, message: string } {
    if (!githubUrl || !githubUrl.includes("github.com/")) {
      return { valid: false, message: "Please enter a valid GitHub repository URL." }
    }
    if (demoUrl && !demoUrl.startsWith("http")) {
      return { valid: false, message: "Please enter a valid Live Demo URL (must start with http)." }
    }
    return { valid: true, message: "Valid submission urls." }
  }
}
