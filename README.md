# GitHub Open API 使用指南

本项目演示如何使用 GitHub Open API 来获取用户项目列表和其他信息。

## 目录

- [简介](#简介)
- [准备工作](#准备工作)
- [身份验证](#身份验证)
- [常用 API 端点](#常用-api-端点)
- [安装和使用](#安装和使用)
- [代码示例](#代码示例)
- [最佳实践](#最佳实践)
- [参考资源](#参考资源)

## 简介

GitHub Open API（也称为 GitHub REST API）是 GitHub 提供的官方 RESTful API，允许开发者与 GitHub 平台进行程序化交互。通过这个 API，你可以：

- 获取仓库信息
- 管理问题和拉取请求
- 访问用户数据
- 管理组织和团队
- 进行代码搜索
- 管理 webhooks

## 准备工作

1. **GitHub 账户**: 确保你有一个 GitHub 账户
2. **Node.js**: 安装 Node.js (推荐版本 14 或更高)
3. **访问令牌**: 创建个人访问令牌用于身份验证

## 身份验证

GitHub API 支持多种身份验证方式：

### 1. 个人访问令牌 (Personal Access Token)

最常用的身份验证方式：

1. 登录 GitHub
2. 转到 Settings → Developer settings → Personal access tokens → Tokens (classic)
3. 点击 "Generate new token"
4. 选择所需的权限范围
5. 生成并保存令牌

### 2. OAuth Apps

适用于需要代表其他用户执行操作的应用程序。

### 3. GitHub Apps

适用于组织级别的集成和自动化。

## 常用 API 端点

### 用户相关
- `GET /user` - 获取当前认证用户信息
- `GET /users/{username}` - 获取指定用户信息
- `GET /user/repos` - 获取当前用户的仓库列表

### 仓库相关
- `GET /repos/{owner}/{repo}` - 获取仓库信息
- `GET /repos/{owner}/{repo}/contents/{path}` - 获取文件内容
- `GET /repos/{owner}/{repo}/issues` - 获取仓库问题列表

### 搜索相关
- `GET /search/repositories` - 搜索仓库
- `GET /search/users` - 搜索用户
- `GET /search/code` - 搜索代码

## 安装和使用

### 1. 克隆项目

```bash
git clone https://github.com/wangbinghua910128/project.git
cd project
```

### 2. 安装依赖

```bash
npm install axios  # 用于 HTTP 请求
```

### 3. 设置环境变量

创建 `.env` 文件：

```bash
GITHUB_TOKEN=your_personal_access_token_here
```

### 4. 运行项目

```bash
node index.js
```

## 代码示例

### 基本请求示例

```javascript
const axios = require('axios');

// 设置基本配置
const githubAPI = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    'Authorization': `token ${process.env.GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'GitHub-API-Client'
  }
});

// 获取当前用户信息
async function getCurrentUser() {
  try {
    const response = await githubAPI.get('/user');
    console.log('当前用户:', response.data.login);
    return response.data;
  } catch (error) {
    console.error('获取用户信息失败:', error.response?.data || error.message);
  }
}

// 获取用户仓库列表
async function getUserRepos() {
  try {
    const response = await githubAPI.get('/user/repos', {
      params: {
        sort: 'updated',
        per_page: 10
      }
    });
    
    console.log('仓库列表:');
    response.data.forEach(repo => {
      console.log(`- ${repo.name}: ${repo.description || '无描述'}`);
    });
    
    return response.data;
  } catch (error) {
    console.error('获取仓库列表失败:', error.response?.data || error.message);
  }
}

// 搜索仓库
async function searchRepositories(query) {
  try {
    const response = await githubAPI.get('/search/repositories', {
      params: {
        q: query,
        sort: 'stars',
        order: 'desc',
        per_page: 5
      }
    });
    
    console.log(`搜索 "${query}" 的结果:`);
    response.data.items.forEach(repo => {
      console.log(`- ${repo.full_name} (⭐ ${repo.stargazers_count})`);
    });
    
    return response.data;
  } catch (error) {
    console.error('搜索失败:', error.response?.data || error.message);
  }
}
```

### 完整的使用示例

```javascript
// index.js 的完整实现
require('dotenv').config();
const axios = require('axios');

class GitHubAPIClient {
  constructor(token) {
    this.api = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GitHub-API-Client'
      }
    });
  }

  async getCurrentUser() {
    const response = await this.api.get('/user');
    return response.data;
  }

  async getUserRepos(options = {}) {
    const params = {
      sort: 'updated',
      per_page: 30,
      ...options
    };
    
    const response = await this.api.get('/user/repos', { params });
    return response.data;
  }

  async getRepo(owner, repo) {
    const response = await this.api.get(`/repos/${owner}/${repo}`);
    return response.data;
  }

  async searchRepos(query, options = {}) {
    const params = {
      q: query,
      sort: 'stars',
      order: 'desc',
      per_page: 10,
      ...options
    };
    
    const response = await this.api.get('/search/repositories', { params });
    return response.data;
  }
}

async function main() {
  try {
    // 初始化 GitHub API 客户端
    const github = new GitHubAPIClient(process.env.GITHUB_TOKEN);
    
    // 获取当前用户信息
    console.log('=== 当前用户信息 ===');
    const user = await github.getCurrentUser();
    console.log(`用户名: ${user.login}`);
    console.log(`姓名: ${user.name || '未设置'}`);
    console.log(`公开仓库数: ${user.public_repos}`);
    
    // 获取用户仓库列表
    console.log('\n=== 用户仓库列表 ===');
    const repos = await github.getUserRepos({ per_page: 5 });
    repos.forEach(repo => {
      console.log(`📁 ${repo.name}`);
      console.log(`   描述: ${repo.description || '无描述'}`);
      console.log(`   语言: ${repo.language || '未知'}`);
      console.log(`   ⭐ ${repo.stargazers_count} 🍴 ${repo.forks_count}`);
      console.log('');
    });
    
    // 搜索热门的 JavaScript 仓库
    console.log('=== 热门 JavaScript 仓库 ===');
    const searchResults = await github.searchRepos('language:javascript', { per_page: 3 });
    searchResults.items.forEach(repo => {
      console.log(`🔥 ${repo.full_name}`);
      console.log(`   ⭐ ${repo.stargazers_count} | ${repo.description}`);
    });
    
  } catch (error) {
    console.error('执行失败:', error.message);
    
    if (error.response?.status === 401) {
      console.error('身份验证失败，请检查你的 GitHub token');
    } else if (error.response?.status === 403) {
      console.error('API 限制达到上限，请稍后再试');
    }
  }
}

main();
```

## 最佳实践

### 1. 错误处理

始终处理可能的错误情况：

```javascript
try {
  const response = await githubAPI.get('/user/repos');
  return response.data;
} catch (error) {
  if (error.response) {
    // 服务器响应了错误状态码
    console.error('API 错误:', error.response.status, error.response.data.message);
  } else if (error.request) {
    // 请求发送了但没有收到响应
    console.error('网络错误:', error.message);
  } else {
    // 其他错误
    console.error('未知错误:', error.message);
  }
}
```

### 2. 速率限制

GitHub API 有速率限制，注意检查：

```javascript
// 检查速率限制
async function checkRateLimit() {
  const response = await githubAPI.get('/rate_limit');
  console.log('剩余请求次数:', response.data.rate.remaining);
  console.log('重置时间:', new Date(response.data.rate.reset * 1000));
}
```

### 3. 分页处理

对于大量数据，使用分页：

```javascript
async function getAllRepos() {
  let allRepos = [];
  let page = 1;
  let hasMore = true;
  
  while (hasMore) {
    const response = await githubAPI.get('/user/repos', {
      params: { page, per_page: 100 }
    });
    
    allRepos = allRepos.concat(response.data);
    hasMore = response.data.length === 100;
    page++;
  }
  
  return allRepos;
}
```

### 4. 安全性

- 永远不要在代码中硬编码访问令牌
- 使用环境变量存储敏感信息
- 定期轮换访问令牌
- 为令牌设置适当的权限范围

## 参考资源

- [GitHub REST API 官方文档](https://docs.github.com/en/rest)
- [GitHub API 速率限制](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting)
- [个人访问令牌文档](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [GitHub Apps 文档](https://docs.github.com/en/developers/apps)

## 许可证

本项目仅用于学习和演示目的。