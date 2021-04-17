export interface Dictonary {
  head: Head;
  def: Definition[];
}

interface Definition {
  text: string;
  pos: string;
  tr: Translate[];
}

interface Translate {
  text: string;
  pos: string;
  syn: Synonym[];
  mean: Synonym[];
  ex: Example[];
}

interface Example {
  text: string;
  syn: Synonym[];
}

interface Synonym {
  text: string;
}

interface Head {
}