const { Octokit } = require("@octokit/rest");
const Dotenv = require("dotenv").config();

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const repositoryOwner = "babyo7";
const repositoryName = "NGL--Database";
const filePath = "data.json";

async function updateFile(newData) {
  try {
    // Fetch current file content
    const response = await octokit.repos.getContent({
      owner: repositoryOwner,
      repo: repositoryName,
      path: filePath,
    });

    const currentData = JSON.parse(
      Buffer.from(response.data.content, "base64").toString("utf-8")
    );

    const usernameExists = currentData.some(
      (entry) => entry.username === newData.username
    );

    if (usernameExists) {
      console.log(`Error: Username '${newData.username}' already exists.`);
      return;
    }
    // Merge existing data with new data
    const updatedData = [...currentData, newData];

    // Update file on GitHub
    const updateResponse = await octokit.repos.createOrUpdateFileContents({
      owner: repositoryOwner,
      repo: repositoryName,
      path: filePath,
      message: "Update data.json",
      content: Buffer.from(JSON.stringify(updatedData, null, 2)).toString(
        "base64"
      ),
      sha: response.data.sha,
    });

    console.log(
      "Data added successfully!",
      updateResponse.data.commit.html_url
    );
  } catch (error) {
    console.error(
      "Error updating file:",
      error.response ? error.response.data : error.message
    );
  }
}

module.exports = updateFile;
