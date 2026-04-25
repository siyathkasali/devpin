import { NextResponse } from "next/server";
import { auth } from "@/src/auth";
import { prisma } from "@/src/lib/db";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        password: true,
        createdAt: true,
        isPro: true,
        stripeCustomerId: true,
        _count: {
          select: {
            items: true,
            collections: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get item breakdown by type
    const itemBreakdown = await prisma.item.groupBy({
      by: ["typeId"],
      where: {
        userId: user.id,
      },
      _count: {
        _all: true,
      },
    });

    // Get type names for the breakdown
    const types = await prisma.itemType.findMany({
      where: {
        id: {
          in: itemBreakdown.map((item) => item.typeId),
        },
      },
      select: {
        id: true,
        name: true,
        icon: true,
        color: true,
      },
    });

    const breakdown = itemBreakdown.map((item) => {
      const type = types.find((t) => t.id === item.typeId);
      return {
        typeId: item.typeId,
        name: type?.name || "Unknown",
        icon: type?.icon || "File",
        color: type?.color || "#888888",
        count: item._count._all,
      };
    });

    // Check if user has password (email/password user) or only OAuth
    const hasPassword = !!(user.password);
    const hasGitHub = !!(await prisma.account.count({
      where: {
        userId: user.id,
        provider: "github",
      },
    }));

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      createdAt: user.createdAt,
      isPro: user.isPro,
      stripeCustomerId: user.stripeCustomerId,
      stats: {
        items: user._count.items,
        collections: user._count.collections,
        breakdown,
      },
      authMethods: {
        hasPassword,
        hasGitHub,
      },
      priceIds: {
        monthly: process.env.STRIPE_PRICE_ID_MONTHLY,
        yearly: process.env.STRIPE_PRICE_ID_YEARLY,
      },
    });
  } catch (error) {
    console.error("Profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
