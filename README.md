## 🎉 项目介绍

青柠客壁纸是一款专注于提供高质量手机壁纸的微信小程序，致力于为用户提供精美的壁纸资源和极致的用户体验。

### ✨ 特色功能

- 🖼️ **海量壁纸资源**：精选优质壁纸，持续更新
- 🔍 **智能搜索**：支持关键词搜索和标签筛选
- 💫 **个性化推荐**：基于用户喜好的智能推荐
- 📱 **便捷下载**：一键保存，快速设置
- 🌈 **多样化分类**：涵盖动漫、风景、人物等多个分类

## 📱 效果预览

<p align="center">
  <img src="docs/images/preview1.png" width="200" alt="首页预览">
  <img src="docs/images/preview2.png" width="200" alt="分类预览">
  <img src="docs/images/preview3.png" width="200" alt="详情预览">
</p>

## 🛠️ 技术特点

- 📦 **分包加载**：优化小程序体积和加载速度
- 🖼️ **瀑布流布局**：完美展示不同尺寸的壁纸
- 💾 **智能缓存**：优化数据加载和用户体验
- 🎨 **精美动效**：流畅的转场和交互动画
- 📝 **TypeScript**：类型安全的代码开发体验

## 🚀 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/ivanvolt-labs/ivan-wallpaper-wechat.git
cd ivan-wallpaper-wechat
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置项目

#### 3.1 复制配置文件
```bash
# 复制小程序配置文件
cp miniprogram/app.example.ts miniprogram/app.ts

# 复制项目配置文件
cp project.config.example.json project.config.json
```

#### 3.2 修改服务器配置

打开 `miniprogram/app.ts`，修改以下配置为你自己的服务器信息：

```typescript
globalData: {
  baseURL: 'https://your-api-server.com',        // 修改为你的API服务器地址
  imgURL: 'https://your-img-server.com/wallpapers', // 修改为你的图片服务器地址
  shareTitle: '你的小程序名称',                    // 修改为你的小程序名称
  version: 'v1.0.0'                               // 修改为你的版本号
}
```

#### 3.3 修改小程序AppID

打开 `project.config.json`，修改以下配置：

```json
{
  "appid": "your-wechat-miniprogram-appid"  // 修改为你的微信小程序AppID
}
```

### 4. 使用微信开发者工具打开项目

- 打开微信开发者工具
- 选择"导入项目"
- 选择项目目录
- 填写AppID（与 `project.config.json` 中配置的一致）

### 5. 编译运行

在微信开发者工具中点击"编译"即可预览小程序

## 🤝 参与贡献

使用过程中遇到任何问题，您可以：

- 🐛 提交 Bug 反馈
- 💡 添加作者微信，拉群交流
- 📝 改进文档内容
- 💻 提交代码优化

## 💬 加入交流群

<p align="center">
  <img src="docs/images/wechat_group_qr.jpg" width="200" alt="微信交流群">
</p>

🎯 **为什么要加入我们？**

- 获取项目最新动态和技术分享
- 与其他开发者交流学习经验
- 参与项目开发，提升个人技术能力
- 获取更多合作机会

> 扫描上方二维码，添加作者微信，备注"GitHub"，即可加入交流群

## 📞 联系方式

- 作者：Ivan
- 微信：JQB_999（备注：GitHub）
- 邮箱：wallpaper_qnk@163.com

## 📄 开源协议

本项目基于 [MIT 协议](LICENSE) 开源，使用时请遵守开源协议。

## ⭐ Star 历史

<p align="center">
  <a href="https://star-history.com/#your-username/qingningke-wxapp&Timeline">
    <img src="https://api.star-history.com/svg?repos=your-username/qingningke-wxapp&type=Timeline" alt="Star History Chart">
  </a>
</p>

---

如果这个项目对你有帮助，欢迎 star 支持 ⭐️