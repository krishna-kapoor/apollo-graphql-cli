import { PrismaClient, User } from "@prisma/client";
import { ExpressContext } from "apollo-server-express";

export interface ctx {
    prisma: PrismaClient;
}

const prisma = new PrismaClient();

export async function getContext(context: ExpressContext) {
    // Your context code goes here...

    return context;
}
