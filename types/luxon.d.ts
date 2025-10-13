declare module 'luxon' {
  export type DateTimeUnit =
    | 'year' | 'quarter' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond';

  export class Duration {
    seconds: number;
    as(unit: string): number;
    toObject(): { years?: number; months?: number; weeks?: number; days?: number; hours?: number; minutes?: number; seconds?: number };
  }

  export class DateTime {
    static now(): DateTime;
    static fromISO(s: string): DateTime;

    weekday: number;

    toISO(): string;
    toFormat(fmt: string): string;
    plus(values: Partial<{ years: number; months: number; weeks: number; days: number; hours: number; minutes: number; seconds: number }>): DateTime;
    minus(values: Partial<{ years: number; months: number; weeks: number; days: number; hours: number; minutes: number; seconds: number }>): DateTime;
    startOf(unit: DateTimeUnit): DateTime;
    setZone(zone: string): DateTime;

    diff(other: DateTime, unit?: string | string[]): Duration;
  }
}
