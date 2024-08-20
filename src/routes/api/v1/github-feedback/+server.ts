import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import OpenAI from "openai";
import { env } from '$env/dynamic/private';

type GitHubUserInfo = {
  login: string;
  name: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY ?? process.env.OPENAI_API_KEY,
});

async function getGitHubUserInfo(username: string): Promise<GitHubUserInfo> {
  const response = await fetch(`https://api.github.com/users/${username}`);
  if (!response.ok) {
    throw new Error(`GitHub API request failed: ${response.statusText}`);
  }
  return response.json();
}

async function generatePositiveFeedback(userInfo: GitHubUserInfo): Promise<string> {

  const prompt = `Generate a positive and encouraging message for a GitHub user with the following information:
    Username: ${userInfo.login}
    Public Repositories: ${userInfo.public_repos}
    Followers: ${userInfo.followers}
    Following: ${userInfo.following}
    Account Created: ${userInfo.created_at}

    The message should:
    1. Be motivating and highlight the user's contributions to open source.
    2. Suggest 3-5 open source projects that:
    - The user hasn't forked yet
    - Are not extremely popular (ideally under 1000 stars)
    - Match the user's apparent interests based on their existing repositories
    - Use languages or tools that appear in the user's repositories

    When suggesting open source projects, always use the following format for each project:
    - Project: [Repository Name](https://github.com/username/repository-name)
      Ensure that the repository name and username are valid GitHub identifiers.
      Why it's a good fit: [Brief explanation]
      How to contribute: [Suggestions for contribution]
      (Note: Please verify the existence of this project before contributing)

    Before suggesting a project, imagine you have verified that the repository actually exists on GitHub and meets the criteria specified. Focus on suggesting projects that are more likely to exist, such as well-known libraries or tools in the programming languages the user frequently uses.

    3. For each suggested project, briefly explain why it might be a good fit and how the user could contribute.
    4. Provide general tips on how to approach contributing to these lesser-known projects.

    Please format the response in a humble, friendly, encouraging tone, and structure it with clear sections for readability. Format the response in standard Markdown.

    Here's an example of a valid project suggestion:
    - Project: [express](https://github.com/expressjs/express)
      Why it's a good fit: This is a popular web application framework for Node.js that aligns with your interest in backend development.
      How to contribute: You could help by improving documentation, fixing bugs, or adding new features.
      (Note: Please verify the existence of this project before contributing)`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
      n: 1,
      temperature: 0.8,
    });

    if (response.choices && response.choices.length > 0) {
      return response.choices[0].message.content?.trim() || "No feedback generated.";
    } else {
      throw new Error("No feedback generated from OpenAI API");
    }
  } catch (error) {
    console.error("Error generating feedback:", error);
    throw new Error("Failed to generate feedback");
  }
}

export const POST: RequestHandler = async ({ request }) => {
  const { username } = await request.json();

  try {
    const userInfo = await getGitHubUserInfo(username);
    const feedback = await generatePositiveFeedback(userInfo);
    return json({ feedback });
  } catch {
    return json({ error: 'Failed to generate feedback' }, { status: 500 });
  }
};
