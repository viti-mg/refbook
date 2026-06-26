export interface CardType {
  id: string;
  name: string;
  color: string;
  display_duration: number;
}

export interface FootballMatchStructure {
  type: "halves";
  duration: number;
  halves: number;
  allow_extra_time: boolean;
}

export interface AthleticsMatchStructure {
  type: "events";
  disciplines: string[];
}

export type MatchStructure = FootballMatchStructure | AthleticsMatchStructure;

export interface FieldDefinition {
  name: string;
  label: string;
  description: string;
  placeholder: string;
  type: "text" | "number" | "boolean" | "date";
  required: boolean;
}

export interface ActionType {
  id: string;
  name: string;
  fields: FieldDefinition[];
}

export interface CompetitionTemplate {
  card_types: CardType[];
  match_structure: MatchStructure;
  action_types: ActionType[];
}

export type TemplateType = "football" | "athletics";
