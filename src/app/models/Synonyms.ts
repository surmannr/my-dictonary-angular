export interface Synonyms {
  response: Response[];
}

interface Response {
  list: Synonym;
}

export interface Synonym {
  category: string;
  synonyms: string;
}