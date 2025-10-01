import { PrismaClient } from "@prisma/client";
import cors from "cors";
import * as fs from "fs";
import { app } from "../src";

const prisma = new PrismaClient();

async function main() {
  // JSON faylni o‘qiymiz
  const rawData = fs.readFileSync("prisma/categories.json", "utf-8");
  const data = JSON.parse(rawData);

  // Rekursiv kategoriya saqlash
  async function saveCategory(category: any, parentId: number | null = null) {
    const savedCategory = await prisma.category.create({
      data: {
        id: category.id,
        name: category.name,
        parentId: parentId,
      },
    });

    if (category.children && category.children.length > 0) {
      for (const child of category.children) {
        await saveCategory(child, savedCategory.id);
      }
    }
  }

  // Boshlang‘ich daraxtni yuklash
  if (data.result && data.result.children) {
    for (const cat of data.result.children) {
      await saveCategory(cat, null);
    }
  }

  console.log("Kategoriyalar muvaffaqiyatli yuklandi!");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  });
app.use(cors({
  origin: "http://localhost:5173", // faqat frontend domeniga ruxsat
  credentials: true
}));
