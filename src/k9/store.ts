// Local persistence for the K9 suite. Data lives in this browser's
// localStorage and can be exported/imported as JSON. The shape is kept flat so
// it can be mirrored to Firebase/Firestore later (see docs/technical/FIREBASE.md).

import type { Discipline } from './breeds';
import type { Activity } from './care';

export interface Dog {
  id: string; name: string; breedId: string; sex: 'F' | 'M'; dob: string; weightLb: number;
  color: string; altered: boolean; microchip: string; handler: string; vet: string;
  goals: Discipline[]; activity: Activity; kcalPerCup: number; notes: string;
}

export type LessonStatus = 'not-started' | 'in-progress' | 'passed';
export interface Progress { status: LessonStatus; date?: string; notes?: string; signedBy?: string }

export type LogType = 'training' | 'health' | 'feeding' | 'exercise' | 'outreach' | 'bite' | 'incident' | 'vet';
export interface LogEntry {
  id: string; dogId: string; type: LogType; date: string; durationMin?: number; location?: string;
  skills?: string; reps?: number; successPct?: number; rating?: number; notes: string; extra?: Record<string, string>;
}

export interface MedRecord { id: string; dogId: string; item: string; given: string; due?: string; provider?: string; notes?: string }

export interface SuiteState {
  version: 1;
  dogs: Dog[];
  activeDogId: string;
  progress: Record<string, Record<string, Progress>>;
  logs: LogEntry[];
  medical: MedRecord[];
  handler: { name: string; certifications: { level: string; date: string; by: string }[]; directorSignoffProtection: Record<string, string> };
}

const KEY = 'ff-k9-suite-v1';
export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
export const today = () => new Date().toISOString().slice(0, 10);

export const GYPSE: Dog = {
  id: 'gypse', name: 'Gypse', breedId: 'pitbull-apbt', sex: 'F', dob: '2024-10-01', weightLb: 50,
  color: 'Blue (blue nose)', altered: true, microchip: '', handler: 'Rev. Mr. Paul Moore', vet: '',
  goals: ['companion', 'esa', 'psd', 'obedience', 'protection'], activity: 'active', kcalPerCup: 380,
  notes: 'Founding dog of the Faith Forward K9 Program. Confirm weight, spay status, birth date, and kibble kcal/cup, then update this profile.',
};

function seed(): SuiteState {
  return {
    version: 1,
    dogs: [GYPSE],
    activeDogId: GYPSE.id,
    progress: {},
    logs: [],
    medical: [],
    handler: { name: 'The Reverend Deacon Paul Moore', certifications: [], directorSignoffProtection: {} },
  };
}

export function load(): SuiteState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as SuiteState;
  } catch { /* storage blocked or corrupt: fall through to seed */ }
  return seed();
}

export function save(s: SuiteState): void {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* private mode: in-memory only */ }
}

export function reset(): SuiteState {
  const s = seed();
  save(s);
  return s;
}

export function download(filename: string, content: string, type = 'application/json'): void {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type }));
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

export function toCsv(rows: Record<string, unknown>[]): string {
  if (!rows.length) return '';
  const cols = [...new Set(rows.flatMap((r) => Object.keys(r)))];
  const cell = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  return [cols.join(','), ...rows.map((r) => cols.map((c) => cell(typeof r[c] === 'object' ? JSON.stringify(r[c]) : r[c])).join(','))].join('\n');
}
