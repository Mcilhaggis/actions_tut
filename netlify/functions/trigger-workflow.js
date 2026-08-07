export async function handler(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const requestBody = JSON.parse(event.body);
  const userPasswordAttempt = requestBody.password;
  const userText = requestBody.message;

  // Retrieve secrets from Netlify Configuration variables
  const UI_ACCESS_PASSWORD = process.env.UI_ACCESS_PASSWORD;
  const GITHUB_TOKEN = process.env.GITHUB_PAT_TOKEN;
  // 1. Validate Password First
  if (!userPasswordAttempt || userPasswordAttempt !== UI_ACCESS_PASSWORD) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Unauthorized: Invalid secret passphrase." })
    };
  }

  const OWNER = "Mcilhaggis";
  const REPO = "actions_tut";
  const WORKFLOW = "workflow_dispatch_manual_trigger.yml"; 

  // 2. Proceed to GitHub Action Trigger if authentication succeeds
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
          ref: "main", 
          inputs: { user_message: userText }
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
