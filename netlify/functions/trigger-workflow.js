exports.handler = async function(event) {

    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: "Method Not Allowed"
        };
    }

    const {
        courseCode,
        courseType,
        streamType,
        repo,
        branch
    } = JSON.parse(event.body);

    const GITHUB_TOKEN = process.env.GITHUB_PAT_TOKEN;

    // const workflowCheck = await fetch(
    //     "https://api.github.com/repos/Mcilhaggis/actions_tut/actions/workflows",
    //     {
    //         headers: {
    //             "Authorization": `Bearer ${GITHUB_TOKEN}`,
    //             "Accept": "application/vnd.github+json"
    //         }
    //     }
    // );

    // const workflowText = await workflowCheck.text();
    // console.log("Workflow List:", workflowText);

    try {
                console.log(
                        courseCode,
                        courseType,
                        streamType,
                        repo,
                        branch);
        const response = await fetch(
            "https://api.github.com/repos/Mcilhaggis/actions_tut/actions/workflows/course-report.yml/dispatches",
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
                    inputs: {
                        courseCode,
                        courseType,
                        streamType,
                        repo,
                        branch
                    }
                })


            }
        );

console.log("Dispatch Status:", response.status);

const responseText = await response.text();

console.log("Dispatch Response:");
console.log(responseText);
        
        if (response.status !== 204) {

            const text =
                await response.text();

            return {
                statusCode: response.status,
                body: text
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Workflow dispatched",
                courseCode,
                repo,
                branch
            })
        };

    } catch(err) {

        return {
            statusCode: 500,
            body: JSON.stringify({
                error: err.message
            })
        };

    }
};