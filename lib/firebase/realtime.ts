'use client';

import {
  DataSnapshot,
  QueryConstraint,
  endAt,
  equalTo,
  get,
  orderByChild,
  query,
  ref,
  startAt,
} from 'firebase/database';

import { getFirebaseClient } from './client';
import type {
  DscCardRecord,
  EventRecord,
  ExecRecord,
  FoodRecord,
  WithKey,
} from './types';

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

const startOfToday = (): number => new Date().setHours(0, 0, 0, 0);

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
  fetchList<EventRecord>(
    '/event',
    [orderByChild('datetime/timeStartTimestamp')],
    { reverse: true }
  );

export const fetchFutureEvents = async (): Promise<WithKey<EventRecord>[]> =>
  fetchList<EventRecord>('/event', [
    orderByChild('datetime/timeStartTimestamp'),
    startAt(startOfToday()),
  ]);

export const fetchPastEvents = async (): Promise<WithKey<EventRecord>[]> =>
  fetchList<EventRecord>(
    '/event',
    [orderByChild('datetime/timeStartTimestamp'), endAt(startOfToday())],
    { reverse: true }
  );

export const fetchAllDscCards = async (): Promise<WithKey<DscCardRecord>[]> =>
  fetchList<DscCardRecord>('/dsc');

export const fetchAllFoodItems = async (): Promise<WithKey<FoodRecord>[]> =>
  fetchList<FoodRecord>('/food', [orderByChild('section')]);
