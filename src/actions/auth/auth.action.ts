"use server";

import {
  actionClient,
  authActionClient,
  superAdminAction,
} from "@/lib/safe-action/SafeAction";
import { headers } from "next/headers";
import {
  loginValidation,
  resetOwnPasswordSchema,
  resetUserPasswordSchema,
  updateUserPasssword,
  upsertUserSchema,
  userIdSchema,
} from "@/actions/auth/validation";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/prisma";

// export const loginAdminPanel = actionClient
//   .inputSchema(loginValidation)
//   .action(async ({ parsedInput }) => {
//     await auth.api.signInEmail({
//       body: {
//         email: parsedInput.email,
//         password: parsedInput.password,
//       },
//       headers: await headers(), // Bu vacibdir
//     });
//   });

export const loginAdminPanel = actionClient
  .inputSchema(loginValidation)
  .action(async ({ parsedInput }) => {
    try {
      const response = await auth.api.signUpEmail({
        body: {
          email: parsedInput.email,
          password: parsedInput.password,
          name: "Togrul",
        },
      });

      return { success: true, data: response };
    } catch (error) {
      const message = (error as Error).message;
      console.error("Xəta baş verdi:", message);
      return { success: false, error: message };
    }
  });
export const logoutUser = actionClient.action(async () => {
  await auth.api.signOut({ headers: await headers() });
});
export const getUsers = async () => {
  return db.user.findMany();
};
export const createUserAction = superAdminAction
  .inputSchema(upsertUserSchema)
  .action(async ({ parsedInput }) => {
    const { email, name, role, password } = parsedInput;

    const existingData = await db.user.findFirst({
      where: { email },
    });

    if (existingData) {
      return {
        success: false,
        error: "Data with this email already exists",
        code: "DUPLICATE",
      };
    }

    return auth.api.createUser({
      headers: await headers(),
      body: {
        email: email,
        password: password!,
        name: name,
        data: { role: role },
      },
    });
  });

export const uptadeUser = superAdminAction
  .inputSchema(upsertUserSchema)
  .action(async ({ parsedInput }) => {
    const { email, name, role, id, password } = parsedInput;

    if (!id) {
      return {
        success: false,
        code: "INVALID_INPUT",
        error: "User id is required",
      };
    }

    const existingUser = await db.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return {
        success: false,
        code: "NOT_FOUND",
        error: "USER not found",
      };
    }

    const updatedUser = await auth.api.adminUpdateUser({
      headers: await headers(),
      body: {
        userId: id,
        data: {
          role: role,
          email: email,
          name: name,
        },
      },
    });

    if (password && password.length >= 8) {
      await auth.api.setUserPassword({
        headers: await headers(),
        body: {
          userId: id,
          newPassword: password,
        },
      });
    }

    return updatedUser;
  });

export const resetUserPassword = superAdminAction
  .inputSchema(resetUserPasswordSchema)
  .action(async ({ parsedInput }) => {
    const { id, password } = parsedInput;

    const existingUser = await db.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return {
        success: false,
        code: "NOT_FOUND",
        error: "USER not found",
      };
    }

    return auth.api.setUserPassword({
      headers: await headers(),
      body: {
        userId: id,
        newPassword: password,
      },
    });
  });

export const deleteUser = superAdminAction
  .inputSchema(userIdSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { id } = parsedInput;
    const user = ctx.user;

    if (user?.id === id) {
      return {
        success: false,
        code: "USER_ERROR",
        error: "You cannot delete yourself",
      };
    }

    const existingData = await db.user.findUnique({
      where: { id },
    });

    if (!existingData) {
      return {
        success: false,
        code: "NOT_FOUND",
        error: "User not found",
      };
    }

    if (user?.role === existingData?.role) {
      return {
        success: false,
        code: "USER_ERROR",
        error: "You cannot delete a user with the same role",
      };
    }

    return auth.api.removeUser({
      headers: await headers(),
      body: { userId: id },
    });
  });
type GetByIDProps = { id: string };
export async function getUsersById({ id }: GetByIDProps) {
  try {
    const category = await db.user.findFirst({
      where: { id: id },
    });

    if (!category) {
      return {
        message: "Data not found",
        code: "NOT_FOUND",
      };
    }
    return { data: category };
  } catch (error) {
    const errorMessage = (error as Error).message;
    return {
      message: `Internal Server Error - ${errorMessage}`,
    };
  }
}

export const resetOwnPasswordAction = authActionClient
  .inputSchema(resetOwnPasswordSchema)
  .action(async ({ parsedInput, ctx }) => {
    const userId = ctx.userId;

    const existingUser = await db.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return {
        success: false,
        code: "NOT_FOUND",
        error: "User not found",
      };
    }

    return auth.api.setUserPassword({
      headers: await headers(),
      body: {
        userId,
        newPassword: parsedInput.password,
      },
    });
  });

export const uptadeUserPassAction = authActionClient
  .inputSchema(updateUserPasssword)
  .action(async ({ parsedInput, ctx }) => {
    const userId = ctx.userId;
    const { currentPassword, newPassword } = parsedInput;

    const existingUser = await db.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return {
        success: false,
        code: "NOT_FOUND",
        error: "USER not found",
      };
    }

    return auth.api.changePassword({
      headers: await headers(),
      body: {
        newPassword: newPassword,
        currentPassword: currentPassword,
        revokeOtherSessions: true,
      },
    });
  });
