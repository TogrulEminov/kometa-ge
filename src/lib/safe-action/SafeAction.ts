import { createSafeActionClient } from "next-safe-action";
import { headers } from "next/headers";
import { auth } from "../auth/auth"; 
import { Role } from "@/services/interface/type";
export const actionClient = createSafeActionClient({
  defaultValidationErrorsShape: "formatted",
  handleServerError: (e) => {
    return e.message;
  },
});
export const authActionClient = actionClient.use(async ({ next }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session || !session.user) {
    throw new Error("Sessiya tapılmadı! Zəhmət olmasa giriş edin.");
  }

  const user = session.user;

  if (user.role === Role.USER) {
    throw new Error("Bu əməliyyat üçün kifayət qədər səlahiyyətiniz yoxdur!");
  }
  return next({
    ctx: {
      userId: session.user.id,
      user: session.user,
    },
  });
});
export const adminAction = actionClient.use(async ({ next }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    throw new Error("Bu əməliyyat üçün icazəniz yoxdur!");
  }

  return next({ ctx: { user: session.user } });
});

export const superAdminAction = actionClient.use(async ({ next }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    throw new Error("Bu əməliyyat üçün icazəniz yoxdur!");
  }

  return next({ ctx: { user: session.user } });
});