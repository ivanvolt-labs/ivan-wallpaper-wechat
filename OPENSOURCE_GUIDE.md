# 开源安全指南

本文档指导如何安全地开源此微信小程序项目，确保服务器信息和敏感配置不被泄露。

## 📋 敏感信息清单

本项目包含以下敏感信息：

| 文件 | 位置 | 内容 |
|------|------|------|
| `miniprogram/app.ts` | 第3行 | API服务器地址 `baseURL` |
| `miniprogram/app.ts` | 第5行 | 图片服务器地址 `imgURL` |
| `miniprogram/app.ts` | 第6行 | 小程序分享标题 |
| `project.config.json` | 第39行 | 微信小程序AppID |
| `project.private.config.json` | 全文件 | 项目私有配置 |

## 🔒 当前保护方案（方案3）

采用 `.gitignore` 忽略敏感文件 + 提供示例文件的方式。

### 已配置的文件

1. **`.gitignore`** - 已配置忽略以下文件：
   - `miniprogram/app.ts` （包含真实服务器配置）
   - `project.config.json` （包含真实AppID）
   - `project.private.config.json` （微信开发者工具私有配置）

2. **示例文件** - 已创建以下示例文件（可安全提交到Git）：
   - `miniprogram/app.example.ts` （服务器配置示例）
   - `project.config.example.json` （项目配置示例）

## 🚀 使用指南

### 给开源项目使用者的说明

如果你是从开源仓库克隆此项目的使用者，需要完成以下配置：

#### 1. 复制配置文件

```bash
# 复制 app 配置
cp miniprogram/app.example.ts miniprogram/app.ts

# 复制项目配置
cp project.config.example.json project.config.json
```

#### 2. 修改配置信息

打开 `miniprogram/app.ts`，修改以下字段：

```typescript
globalData: {
  baseURL: 'https://your-api-server.com',      // 修改为你的API服务器地址
  imgURL: 'https://your-img-server.com/wallpapers',  // 修改为你的图片服务器地址
  shareTitle: '你的小程序名称',                 // 修改为你的小程序名称
  version: 'v1.0.0'                             // 修改为你的版本号
}
```

打开 `project.config.json`，修改以下字段：

```json
{
  "appid": "your-wechat-miniprogram-appid"  // 修改为你的微信小程序AppID
}
```

#### 3. 安装依赖并运行

```bash
npm install
```

然后使用微信开发者工具打开项目。

## ✅ 开源前检查清单

### 必须完成的步骤

在推送代码到公开仓库前，请确保完成以下所有步骤：

- [ ] **检查 `.gitignore` 是否生效**
  ```bash
  git status
  ```
  确认输出中**不包含** `miniprogram/app.ts`、`project.config.json`、`project.private.config.json`

- [ ] **确认示例文件已创建**
  ```bash
  ls -la miniprogram/app.example.ts
  ls -la project.config.example.json
  ```

- [ ] **搜索代码中是否还有敏感信息**
  ```bash
  # 搜索真实域名
  grep -r "putablecloth" . --exclude-dir=node_modules --exclude-dir=.git

  # 搜索真实AppID
  grep -r "wx56374d52706089cf" . --exclude-dir=node_modules --exclude-dir=.git
  ```
  **预期结果**：应该只在被忽略的文件中找到（如 `miniprogram/app.ts`）

- [ ] **检查 Git 追踪的文件**
  ```bash
  git ls-files | grep -E "(app.ts|project.config.json|project.private)"
  ```
  **预期结果**：应该只显示 `app.example.ts` 和 `project.config.example.json`

- [ ] **查看即将提交的内容**
  ```bash
  git add .
  git status
  git diff --cached
  ```
  确认没有敏感信息

### 推荐完成的步骤

- [ ] 在 README.md 中添加配置说明（参考本文档的"使用指南"部分）
- [ ] 添加开源协议文件（如 MIT、Apache 2.0 等）
- [ ] 运行依赖安全检查
  ```bash
  npm audit
  ```

## ⚠️ 重要提醒

### 如果已经泄露了敏感信息怎么办？

如果你**已经**将包含敏感信息的文件推送到了公开仓库：

#### 🚨 立即行动

1. **立即更换所有泄露的密钥和密码**
2. **更换微信小程序AppID**（如果可能，或在微信后台限制访问）
3. **修改服务器配置**，限制访问来源（IP白名单、API密钥等）

#### 🧹 清理Git历史

即使你删除了文件，Git历史中仍然保留。需要彻底清理：

**方案1：创建新仓库（推荐，最安全）**
```bash
# 1. 删除 .git 目录
rm -rf .git

# 2. 重新初始化Git
git init

# 3. 确保 .gitignore 配置正确
cat .gitignore

# 4. 添加文件（敏感文件会被自动忽略）
git add .
git commit -m "Initial commit"

# 5. 推送到新的远程仓库
git remote add origin <新仓库地址>
git push -u origin main
```

**方案2：使用 git-filter-repo 清理历史**
```bash
# 安装 git-filter-repo
pip install git-filter-repo

# 从历史中移除敏感文件
git filter-repo --path miniprogram/app.ts --invert-paths
git filter-repo --path project.config.json --invert-paths
git filter-repo --path project.private.config.json --invert-paths

# 强制推送（危险操作，确保团队知晓）
git push origin --force --all
```

#### 📊 监控异常访问

- 查看服务器日志，检查是否有异常访问
- 设置告警，监控API调用量和来源IP
- 考虑启用API限流和访问控制

## 📚 最佳实践

### 日常开发建议

1. **定期检查敏感信息**
   ```bash
   git diff HEAD
   ```
   提交前确认没有包含敏感信息

2. **使用 pre-commit hook**
   可以创建 `.git/hooks/pre-commit` 自动检查：
   ```bash
   #!/bin/bash
   if git diff --cached --name-only | grep -E "(app.ts|project.config.json)$"; then
     echo "错误: 不允许提交敏感配置文件！"
     exit 1
   fi
   ```

3. **团队协作**
   确保所有团队成员都了解哪些文件包含敏感信息，不要提交到Git

## 🆘 需要帮助？

如果在配置过程中遇到问题，请检查：

1. 文件路径是否正确
2. 配置格式是否有语法错误
3. 微信开发者工具是否能正常识别配置

---

**最后提醒**：一旦推送到公开仓库，数据可能被他人克隆保存，务必在开源前仔细检查！
