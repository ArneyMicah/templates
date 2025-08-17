export async function uploadFile(ctx) {
  const file = ctx.request.files.file; // 需要 koa-body 支持
  // 保存文件逻辑省略
  ctx.body = { message: "File uploaded", filename: file.name };
}
