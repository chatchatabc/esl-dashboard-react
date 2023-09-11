import { createTRPCReact } from "@trpc/react-query";
import type { TrpcRouter } from "../../../../esl-workers/src/application/trpc/index";

export const trpc = createTRPCReact<TrpcRouter>();
