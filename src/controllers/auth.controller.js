import * as authService from "../services/auth.service.js";
import { HTTP_STATUS, MESSAGES } from "../constants/index.js";

export async function login(ctx) {
  const { email, password } = ctx.request.body;
  const token = await authService.login(email, password);

  if (!token) {
    ctx.status = HTTP_STATUS.UNAUTHORIZED;
    ctx.body = { message: MESSAGES.LOGIN_FAILED };
    return;
  }

  ctx.status = HTTP_STATUS.OK;
  ctx.body = { token, message: MESSAGES.LOGIN_SUCCESS };
}
