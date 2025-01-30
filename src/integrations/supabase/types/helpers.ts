import { Database } from "./database";

type PublicSchema = Database["public"]

export type Tables<
  TableName extends keyof PublicSchema["Tables"],
  Type extends "Row" | "Insert" | "Update" = "Row"
> = PublicSchema["Tables"][TableName][Type]

export type Enums<
  EnumName extends keyof PublicSchema["Enums"]
> = PublicSchema["Enums"][EnumName]