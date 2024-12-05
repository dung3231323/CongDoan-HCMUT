import { SetMetadata } from "@nestjs/common";

export const MODERATOR_KEY = "isModerator";
export const ADD_MODERATOR = () => SetMetadata(MODERATOR_KEY, true);
