import { faker } from '@faker-js/faker';

export type User = {
  userId: number;
  name: string;
};

export type Message = {
  messageId: number;
  user: User;
  message: string;
  date: string;
};

export type ChatFeatureState = {
  /** all messages */
  allMessages: Message[];
  /** all users in the app */
  allUsers: User[];
  /** if I want to filter out messages per specific user */
  selectedUser: User;
};

export const randomUsers = Array.from({ length: 8 }).map(
  (_, index) =>
    ({
      userId: index,
      name: faker.person.fullName(),
    } satisfies User)
);

export const getRandomIndex = (max: number): number => {
  return Math.floor(Math.random() * max);
};

export const gerRandomItem = <T>(items: T[]): T => {
  const index = getRandomIndex(items.length);
  return items[index];
};

export const randomMessages = Array.from({ length: 30 }).map(
  (_, index) =>
    ({
      messageId: index,
      user: gerRandomItem(randomUsers),
      message: faker.lorem.paragraph({ min: 1, max: 3 }),
      date: new Date().toString(),
    } satisfies Message)
);
