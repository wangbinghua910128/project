const Koa = require('koa');

function main() {
  // 调用 github open api，获取当前用户项目列表
  
  // 创建 Koa 服务器
  const app = new Koa();
  
  // 基本路由
  app.use(async (ctx) => {
    ctx.body = 'Hello World';
  });
  
  // 监听 8080 端口
  app.listen(8080, () => {
    console.log('Server running on port 8080');
  });
}

main()
