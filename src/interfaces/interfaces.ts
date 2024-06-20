export interface Deltager {
    id: number;
    navn: string;
    køn: string;
    alder: number;
    klub: string;
    discipliner: Disciplin[];
}

export interface Disciplin {
    id: number;
    navn: string;
    resultatType: string;
}