
export async function handler(event, context) {
  // Only allow POST requests to this endpoint
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // Retrieve your secret from Netlify's environment variables
  const GITHUB_TOKEN = process.env.GITHUB_PAT_TOKEN;
  
  const OWNER = "your-github-username-or-org";
  const REPO = "your-repo-name";
  const WORKFLOW = "manual-trigger.yml"; // Your workflow YAML filename

  try {
    const response = await fetch(
      `https://github.com{OWNER}/${REPO}/actions/workflows/${WORKFLOW}/dispatches`,
      {
        method: "POST",
        headers: {
          "Accept": "application/vnd.github+json",
          "Authorization": `Bearer ${GITHUB_TOKEN}`,
          "X-GitHub-Api-Version": "2022-11-28",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ref: "main", // Target branch
          inputs: {
            environment: "production" // Optional inputs matching your YAML
          }
        })
    });

    if (response.status === 204) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Workflow triggered successfully!" })
      };
    } else {
      const errText = await response.text();
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "GitHub API error", details: errText })
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}
