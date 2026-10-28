import { NextResponse } from "next/server";
import { getPortfolioData, PortfolioApiError } from "@/lib/api/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getPortfolioData();

    return NextResponse.json({ data });
  } catch (error) {
    const message =
      error instanceof PortfolioApiError
        ? error.message
        : "Une erreur inattendue est survenue.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
