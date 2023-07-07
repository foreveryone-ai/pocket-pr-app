import { POST } from "../app/api/form-submit/route";
import { NextRequest } from "next/server";

describe("POST function", () => {
  it("should return a response with status 200 when the request method is POST", async () => {
    const req = new NextRequest("/", { method: "POST" });
    const response = await POST(req);
    expect(response.status).toBe(200);
  });

  it("should return a response with status 405 when the request method is not POST", async () => {
    const req = new NextRequest("/", { method: "GET" });
    const response = await POST(req);
    expect(response.status).toBe(405);
  });

  it("should return a response with status 500 when there is an error submitting the form", async () => {
    const req = new NextRequest("/", { method: "POST" });
    const response = await POST(req);
    expect(response.status).toBe(500);
  });
});
