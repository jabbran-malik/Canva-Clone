import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
// runtime Validation  check the data in run time is it according to zod schema
import z from "zod";

const app = new Hono()
// 
  .get("/", (c) => {
    return c.json({ user: "GET" });
  })
// 
  .get("/:name", zValidator("param", z.object({ name: z.string() })), (c) => {
    const params = c.req.valid("param");
    // zValidator ne jo URL parameter validate kiya tha, woh validated parameter humein de do.
    return c.json({ userName: params.name });
  });

export default app;

//  z.object schema structure method