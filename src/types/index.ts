export interface Team {
  id: number;
  name: string;
  logo: string | null;
  coach: string;
  stadium: string | null;
  founded: number | null;
  players?: Player[];
}

export interface Player {
  id: number;
  name: string;
  position: string;
  number: number;
  photo: string | null;
  teamId: number;
}

export interface Match {
  id: number;
  date: string;
  homeTeamId: number;
  awayTeamId: number;
  homeScore: number | null;
  awayScore: number | null;
  isFinished: boolean;
  homeTeam: Team;
  awayTeam: Team;
}

export interface Standing {
  id: number;
  team: { name: string; logo: string | null };
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}