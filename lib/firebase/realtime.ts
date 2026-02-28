'use client';

import {
  DataSnapshot,
  QueryConstraint,
  equalTo,
  get,
  orderByChild,
  query,
  ref,
} from 'firebase/database';

import { getFirebaseClient } from './client';
import type {
  DscCardRecord,
  EventRecord,
  ExecRecord,
  FoodRecord,
  WithKey,
} from './types';
import { getEventStartTimestamp, getEventTiming } from '@/lib/events/schedule';

const mapList = <T extends Record<string, unknown>>(
  snapshot: DataSnapshot
): WithKey<T>[] => {
  const records: WithKey<T>[] = [];

  snapshot.forEach((childSnapshot) => {
    records.push({
      $key: childSnapshot.key ?? '',
      ...(childSnapshot.val() as T),
    });
  });

  return records;
};

const fetchList = async <T extends Record<string, unknown>>(
  path: string,
  constraints: QueryConstraint[] = [],
  options: { reverse?: boolean } = {}
): Promise<WithKey<T>[]> => {
  const { database } = getFirebaseClient();
  const dbRef = ref(database, path);
  const dbQuery = constraints.length > 0 ? query(dbRef, ...constraints) : dbRef;
  const snapshot = await get(dbQuery);
  const list = mapList<T>(snapshot);
  return options.reverse ? [...list].reverse() : list;
};

const fetchOne = async <T extends Record<string, unknown>>(
  path: string,
  key: string
): Promise<WithKey<T> | null> => {
  const { database } = getFirebaseClient();
  const snapshot = await get(ref(database, `${path}/${key}`));

  if (!snapshot.exists()) {
    return null;
  }

  return {
    $key: key,
    ...(snapshot.val() as T),
  };
};

export const fetchAllExecs = async (): Promise<WithKey<ExecRecord>[]> =>
  fetchList<ExecRecord>(
    '/exec',
    [orderByChild('isCurrentExec')],
    { reverse: true }
  );

export const fetchCurrentExecs = async (): Promise<WithKey<ExecRecord>[]> =>
  fetchList<ExecRecord>('/exec', [
    orderByChild('isCurrentExec'),
    equalTo(true),
  ]);

export const fetchPreviousExecs = async (): Promise<WithKey<ExecRecord>[]> =>
  fetchList<ExecRecord>('/exec', [
    orderByChild('isCurrentExec'),
    equalTo(false),
  ]);

export const fetchAllEvents = async (): Promise<WithKey<EventRecord>[]> =>
  fetchList<EventRecord>('/event');

export const fetchFutureEvents = async (): Promise<WithKey<EventRecord>[]> => {
  const now = Date.now();
  const events = await fetchAllEvents();

  return events.filter((event) => {
    const timing = getEventTiming(event, now);
    if (timing.isOngoing) {
      return false;
    }
    if (timing.isRecurring) {
      return timing.nextStartTimestamp !== null;
    }

    const startTimestamp = getEventStartTimestamp(event);
    return typeof startTimestamp === 'number' && startTimestamp >= now;
  });
};

export const fetchPastEvents = async (): Promise<WithKey<EventRecord>[]> => {
  const now = Date.now();
  const events = await fetchAllEvents();

  return events.filter((event) => {
    const timing = getEventTiming(event, now);
    if (timing.isRecurring || timing.isOngoing) {
      return false;
    }

    const startTimestamp = getEventStartTimestamp(event);
    return typeof startTimestamp === 'number' && startTimestamp < now;
  });
};

export const fetchEventById = async (
  eventId: string
): Promise<WithKey<EventRecord> | null> => fetchOne<EventRecord>('/event', eventId);

export const fetchAllDscCards = async (): Promise<WithKey<DscCardRecord>[]> =>
  fetchList<DscCardRecord>('/dsc');

export const fetchAllFoodItems = async (): Promise<WithKey<FoodRecord>[]> =>
  fetchList<FoodRecord>('/food', [orderByChild('section')]);
