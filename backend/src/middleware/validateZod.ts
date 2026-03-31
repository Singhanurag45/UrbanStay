import type { Request, Response, NextFunction } from "express";
import type { ZodIssue, ZodTypeAny } from "zod";

type Schemas = {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
};

const formatZodIssues = (issues: ZodIssue[]) => {
  return issues.map((issue) => ({
    path:
      issue.path?.length
        ? issue.path
            .map((segment) =>
              typeof segment === "string" || typeof segment === "number"
                ? segment
                : String(segment)
            )
            .join(".")
        : undefined,
    message: issue.message || "Invalid value",
  }));
};

export const validateZod =
  (schemas: Schemas) =>
  (req: Request, res: Response, next: NextFunction) => {
    const errors: unknown[] = [];

    if (schemas.params) {
      const parsed = schemas.params.safeParse(req.params);
      if (!parsed.success) errors.push(...formatZodIssues(parsed.error.issues));
      else Object.assign(req.params as any, parsed.data);
    }

    if (schemas.query) {
      const parsed = schemas.query.safeParse(req.query);
      if (!parsed.success) errors.push(...formatZodIssues(parsed.error.issues));
      else Object.assign(req.query as any, parsed.data);
    }

    if (schemas.body) {
      const parsed = schemas.body.safeParse(req.body);
      if (!parsed.success) errors.push(...formatZodIssues(parsed.error.issues));
      else Object.assign(req.body as any, parsed.data);
    }

    if (errors.length) {
      return res.status(400).json({
        message: "Validation failed",
        errors,
      });
    }

    next();
  };

