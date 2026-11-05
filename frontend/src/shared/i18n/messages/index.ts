import { common } from "./common";
import { dashboard } from "./dashboard";
import { shell } from "./shell";
import type { Messages } from "./types";

export const MESSAGES = { ...common, ...shell, ...dashboard };
export type MsgKey = keyof typeof MESSAGES;
export const messages: Messages = MESSAGES;
