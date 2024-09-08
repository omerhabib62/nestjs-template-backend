import { SetMetadata } from "@nestjs/common";
import { IS_PUBLIC_KEY } from "src/auth/auth.constants";

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
