import cron from "node-cron";
import { PrismaClient } from "@prisma/client"; // adjust import as needed

const prisma = new PrismaClient();

// Runs every minute
cron.schedule("* * * * *", async () => {
  const now = new Date();
  try {
    const postsToPublish = await prisma.post.findMany({
      where: {
        published: false,
        scheduledAt: { lte: now },
      },
    });

    for (const post of postsToPublish) {
      await prisma.post.update({
        where: { id: post.id },
        data: { published: true },
      });
      console.log(`Published scheduled post: ${post.title}`);
    }
  } catch (err) {
    console.error("Auto-publish error:", err);
  }
});