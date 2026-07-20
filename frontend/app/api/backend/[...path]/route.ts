import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

const backendUrl = process.env.BACKEND_URL ?? "http://127.0.0.1:8080";

async function proxyRequest(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  const targetUrl = new URL(path.join("/"), backendUrl);
  targetUrl.search = request.nextUrl.search;

  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("connection");
  headers.delete("content-length");
  headers.delete("expect");

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: ["GET", "HEAD"].includes(request.method) ? undefined : await request.text(),
      cache: "no-store",
    });

    const responseHeaders = new Headers(response.headers);
    responseHeaders.delete("content-encoding");
    responseHeaders.delete("content-length");

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Falha ao conectar ao back-end:", error);
    return NextResponse.json(
      {
        message: "Back-end indisponível.",
      },
      { status: 503 },
    );
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}
