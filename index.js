// GitHub Open API 使用示例
// 请先安装依赖: npm install axios dotenv
// 并设置 .env 文件中的 GITHUB_TOKEN

// 尝试加载 dotenv，如果不存在则忽略
try {
  require('dotenv').config();
} catch (e) {
  // dotenv 未安装，继续执行
}

async function main() {
  console.log('GitHub Open API 演示项目');
  console.log('========================');
  
  // 检查是否设置了 GitHub token
  if (!process.env.GITHUB_TOKEN) {
    console.log('⚠️  请先设置 GitHub Personal Access Token:');
    console.log('1. 复制 .env.example 为 .env');
    console.log('2. 在 .env 文件中设置你的 GITHUB_TOKEN');
    console.log('3. 运行 npm install 安装依赖');
    console.log('4. 再次运行 node index.js');
    return;
  }
  
  try {
    // 动态导入 axios（如果已安装）
    const axios = require('axios');
    
    // GitHub API 基本配置
    const githubAPI = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GitHub-API-Demo'
      }
    });
    
    // 获取当前用户信息
    console.log('正在获取用户信息...');
    const userResponse = await githubAPI.get('/user');
    const user = userResponse.data;
    
    console.log(`✅ 成功连接到 GitHub API`);
    console.log(`👤 用户: ${user.login}`);
    console.log(`📁 公开仓库数: ${user.public_repos}`);
    
    // 获取用户项目列表
    console.log('\n正在获取项目列表...');
    const reposResponse = await githubAPI.get('/user/repos', {
      params: {
        sort: 'updated',
        per_page: 5
      }
    });
    
    console.log('\n📂 最近更新的项目:');
    reposResponse.data.forEach((repo, index) => {
      console.log(`${index + 1}. ${repo.name}`);
      console.log(`   📝 ${repo.description || '无描述'}`);
      console.log(`   🔗 ${repo.html_url}`);
      console.log('');
    });
    
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.log('❌ 缺少依赖，请运行: npm install');
    } else if (error.response?.status === 401) {
      console.log('❌ GitHub token 无效，请检查 .env 文件中的 GITHUB_TOKEN');
    } else {
      console.log('❌ 发生错误:', error.message);
    }
  }
}

main()
