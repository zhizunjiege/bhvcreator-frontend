declare global {
  type Modified<T, R> = Omit<T, keyof R> & R;

  type Nullable<T> = T | null;

  type Optional<T> = T | undefined;
}

export {};
