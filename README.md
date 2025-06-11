# GitHub Projects JSON API Interface

这是一个 JSON 响应接口，用于获取 GitHub 的 Projects 列表。

## 功能特性

- 调用 GitHub Open API 获取项目列表
- 返回标准化的 JSON 格式响应
- 支持多种获取模式：
  - 认证用户的仓库（需要 GitHub Token）
  - 指定用户的公开仓库
  - 热门公开仓库（默认）
- 网络连接异常时提供模拟数据

## 安装依赖

```bash
npm install
```

## 使用方法

### 基本使用

```bash
# 获取热门公开仓库（默认）
node index.js

# 获取指定用户的公开仓库
node index.js username
```

### 使用 GitHub Token（可选）

设置环境变量 `GITHUB_TOKEN` 来获取认证用户的仓库：

```bash
export GITHUB_TOKEN=your_github_token
node index.js
```

## JSON 响应格式

```json
{
  "success": true,
  "count": 2,
  "projects": [
    {
      "id": 1,
      "name": "project-name",
      "full_name": "user/project-name",
      "description": "Project description",
      "html_url": "https://github.com/user/project-name",
      "clone_url": "https://github.com/user/project-name.git",
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "language": "JavaScript",
      "stargazers_count": 42,
      "forks_count": 7,
      "private": false
    }
  ],
  "source": "github_api"
}
```

## 响应字段说明

- `success`: API 调用是否成功
- `count`: 返回的项目数量
- `projects`: 项目列表数组
- `source`: 数据来源（`github_api` 或 `mock_data`）
- `note`: 当使用模拟数据时的说明信息

## 项目字段说明

每个项目包含以下信息：
- `id`: 项目 ID
- `name`: 项目名称
- `full_name`: 完整项目名称（用户名/项目名）
- `description`: 项目描述
- `html_url`: GitHub 页面链接
- `clone_url`: Git 克隆链接
- `created_at`: 创建时间
- `updated_at`: 最后更新时间
- `language`: 主要编程语言
- `stargazers_count`: Star 数量
- `forks_count`: Fork 数量
- `private`: 是否为私有仓库