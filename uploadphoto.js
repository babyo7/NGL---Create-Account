const { Octokit } = require("@octokit/rest");
const fs = require("fs");
const path = require("path");

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const owner = "babyo7"; // Replace with your GitHub username
const repo = "happy-music"; // Replace with your GitHub repository name
const branch = "main"; // Replace with your branch name

async function uploadPhoto(photoPath) {
  let photoData;
  const photoName = path.basename(photoPath);
  try {
    photoData = fs.readFileSync(photoPath);
  } catch (error) {
    console.log(`Error : no such directory ${photoName}`);
    return;
  }

  try {
    const content = await octokit.repos.getContent({
      owner,
      repo,
      path: `Cover/${photoName}`, // Use the original photo name in the path
      ref: branch,
    });

    const response = await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: `Cover/${photoName}`, // Use the original photo name in the path
      message: "Upload photo",
      content: photoData.toString("base64"),
      sha: content.data.sha,
      branch,
    });

    console.log("Photo uploaded successfully:", response.data.commit.html_url);
  } catch (error) {
    if (error.status === 404) {
      const response = await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: `Cover/${photoName}`,
        message: "Upload photo",
        content: photoData.toString("base64"),
        branch,
      });

      console.log(
        "Photo uploaded successfully:",
        response.data.commit.html_url
      );
    } else {
      console.error("Error uploading photo:");
    }
  }
}

module.exports = uploadPhoto;
