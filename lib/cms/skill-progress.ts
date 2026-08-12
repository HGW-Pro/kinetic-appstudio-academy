import { supabase } from "../supabaseClient";
import type { SkillProgressItem } from "../../components/academy/learningPathTypes";

type UnknownRow = Record<string, unknown>;

function numericValue(row: UnknownRow, keys: string[]): number | null {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "number" && Number.isFinite(value)) return Math.max(0, Math.min(100, Math.round(value)));
  }
  return null;
}

function stringValue(row: UnknownRow, keys: string[]): string | null {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

// Read-only browser query for the separately tracked skills model. The
// schema has evolved independently from the CMS, so the normalizer accepts
// the established percentage/name field variants without writing or
// inferring any data.
export async function getEmployeeSkillProgress(userId?: string | null): Promise<SkillProgressItem[]> {
  const { data: rawSkills, error: skillsError } = await supabase.from("skills").select("*");
  if (skillsError || !rawSkills?.length) return [];

  const skills = rawSkills as UnknownRow[];
  let progressRows: UnknownRow[] = [];
  if (userId) {
    const { data, error } = await supabase
      .from("employee_skill_progress")
      .select("*")
      .eq("employee_id", userId);
    if (!error) progressRows = (data ?? []) as UnknownRow[];
  }

  const progressBySkillId = new Map(
    progressRows
      .map((row) => {
        const id = stringValue(row, ["skill_id"]);
        const percentage = numericValue(row, ["progress_pct", "completion_pct", "score_pct", "proficiency_pct", "percentage"]);
        return id && percentage !== null ? [id, percentage] as const : null;
      })
      .filter((row): row is readonly [string, number] => Boolean(row))
  );

  return skills
    .map((row, index) => {
      const id = stringValue(row, ["id"]) ?? `skill-${index}`;
      const name = stringValue(row, ["name", "title", "skill_name"]);
      if (!name) return null;
      const directPercentage = numericValue(row, ["progress_pct", "completion_pct", "score_pct", "proficiency_pct", "percentage"]);
      return {
        id,
        name,
        percentage: progressBySkillId.get(id) ?? directPercentage ?? 0,
        sequence: numericValue(row, ["sequence_order", "sort_order", "position"]) ?? index,
      };
    })
    .filter((row): row is (SkillProgressItem & { sequence: number }) => Boolean(row))
    .sort((a, b) => a.sequence - b.sequence)
    .map(({ sequence: _sequence, ...skill }) => skill);
}
