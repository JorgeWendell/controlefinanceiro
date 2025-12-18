import { getGanhosAction } from "../actions";
import { GanhoTable } from "./ganho-table";

interface GanhoListProps {
  mes?: number;
  ano?: number;
}

export async function GanhoList({ mes, ano }: GanhoListProps) {
  const ganhos = await getGanhosAction(mes, ano);

  return <GanhoTable ganhos={ganhos} />;
}
