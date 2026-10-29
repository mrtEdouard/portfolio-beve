import { z } from "zod";

// Validations génériques partagées par plusieurs fonctionnalités de l'API.
export const idSchema = z.number().int().positive();
export const dateSchema = z.string().datetime({ offset: true });
export const nullableDateSchema = dateSchema.nullable();
export const nullableUrlSchema = z.string().url().nullable();

export const slugSchema = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
