exports.handler = async function(event) {

    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({
                error: "Method Not Allowed"
            })
        };
    }

    try {

        const { repo } =
            JSON.parse(event.body);

        const encodedRepo =
            encodeURIComponent(repo);

        const response =
            await fetch(
                `https://gitlab.com/api/v4/projects/${encodedRepo}/repository/branches`,
                {
                    headers: {
                        "PRIVATE-TOKEN":
                            process.env.GITLAB_TOKEN
                    }
                }
            );

console.log("Repo:", repo);
console.log("Encoded:", encodedRepo);

        const data =
            await response.json();

console.log(
    JSON.stringify(data, null, 2)
);

        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };

    } catch (err) {

        return {
            statusCode: 500,
            body: JSON.stringify({
                error: err.message
            })
        };

    }
};