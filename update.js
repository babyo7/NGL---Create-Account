const { Octokit } = require("@octokit/rest");
const Dotenv = require("dotenv").config();

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const repositoryOwner = "babyo7";
const repositoryName = "NGL--Database";
const filePath = "data.json";

async function updateUser(idToUpdate, fieldToUpdate, updatedText) {
  try {
    const response = await octokit.repos.getContent({
      owner: repositoryOwner,
      repo: repositoryName,
      path: filePath,
    });
    const currentData = JSON.parse(
      Buffer.from(response.data.content, "base64").toString("utf-8")
    );

    const userToUpdate = currentData.find((user) => user.id === idToUpdate);

    if (!userToUpdate) {
      console.log("Error: User with the provided ID not found.");
      return;
    }

    userToUpdate[fieldToUpdate] = updatedText;

    const updateResponse = await octokit.repos.createOrUpdateFileContents({
      owner: repositoryOwner,
      repo: repositoryName,
      path: filePath,
      message: "Update data.json",
      content: Buffer.from(JSON.stringify(currentData, null, 2)).toString(
        "base64"
      ),
      sha: response.data.sha,
    });

    console.log(
      "Data updated successfully!",
      updateResponse.data.commit.html_url
    );
  } catch (error) {
    console.error("Error updating file:", error.response);
  }
}

module.exports = updateUser;
