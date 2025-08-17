import * as userService from "../services/user.service.js";
import { HTTP_STATUS, MESSAGES } from "../constants/index.js";

export async function getUser(ctx) {
    const { id } = ctx.params;
    const user = await userService.findUserById(id);

    if (!user) {
        ctx.status = HTTP_STATUS.NOT_FOUND;
        ctx.body = { message: MESSAGES.USER_NOT_FOUND };
        return;
    }

    ctx.status = HTTP_STATUS.OK;
    ctx.body = { data: user };
}

export async function createUser(ctx) {
    const { username, email, password } = ctx.request.body;

    const newUser = await userService.createUser({ username, email, password });

    ctx.status = HTTP_STATUS.CREATED;
    ctx.body = { data: newUser, message: "User created successfully" };
}
