import { NextRequest, NextResponse } from "next/server";

export function GET(
  request: NextRequest,
  { params }: { params: { testId: string } }
) {
  return NextResponse.json({
    hello: "good",
    testId: params.testId,
  });
}
