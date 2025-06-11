const { Octokit } = require('@octokit/rest');

// Mock data for offline testing
const mockProjects = [
  {
    id: 1,
    name: "example-project",
    full_name: "user/example-project",
    description: "An example GitHub project",
    html_url: "https://github.com/user/example-project",
    clone_url: "https://github.com/user/example-project.git",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    language: "JavaScript",
    stargazers_count: 42,
    forks_count: 7,
    private: false
  },
  {
    id: 2,
    name: "another-project",
    full_name: "user/another-project",
    description: "Another example project",
    html_url: "https://github.com/user/another-project",
    clone_url: "https://github.com/user/another-project.git",
    created_at: "2023-06-01T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
    language: "Python",
    stargazers_count: 15,
    forks_count: 3,
    private: false
  }
];

async function getGitHubProjects(username = null) {
  try {
    // 创建 Octokit 实例 (可以在环境变量中配置 GitHub token)
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN, // 可选：用于认证，提高API限制
    });

    let response;
    
    if (process.env.GITHUB_TOKEN) {
      // 如果有认证token，获取当前用户的仓库
      response = await octokit.rest.repos.listForAuthenticatedUser({
        sort: 'updated',
        per_page: 50
      });
    } else if (username) {
      // 如果提供了用户名，获取该用户的公开仓库
      response = await octokit.rest.repos.listForUser({
        username: username,
        sort: 'updated',
        per_page: 50
      });
    } else {
      // 默认获取一些公开的热门仓库作为示例
      const searchResponse = await octokit.rest.search.repos({
        q: 'stars:>1000 language:javascript',
        sort: 'stars',
        order: 'desc',
        per_page: 10
      });
      response = { data: searchResponse.data.items };
    }

    // 返回 JSON 格式的项目列表
    const projects = response.data.map(repo => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      html_url: repo.html_url,
      clone_url: repo.clone_url,
      created_at: repo.created_at,
      updated_at: repo.updated_at,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      private: repo.private || false
    }));

    return {
      success: true,
      count: projects.length,
      projects: projects,
      source: 'github_api'
    };
  } catch (error) {
    console.log('GitHub API 调用失败，使用模拟数据:', error.message);
    
    // 如果API调用失败，返回模拟数据
    return {
      success: true,
      count: mockProjects.length,
      projects: mockProjects,
      source: 'mock_data',
      note: '由于网络连接问题，返回模拟数据。在有网络连接时将使用真实的 GitHub API。'
    };
  }
}

async function main() {
  console.log('正在获取 GitHub 项目列表...');
  
  // 从命令行参数获取用户名（可选）
  const username = process.argv[2];
  
  const result = await getGitHubProjects(username);
  
  // 输出 JSON 响应
  console.log(JSON.stringify(result, null, 2));
}

main().catch(console.error);
