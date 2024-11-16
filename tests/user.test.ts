import { test, expect } from '@playwright/test';
import { UserApiClient } from '../src/client-api';

test.describe('User Management API Tests', () => {
    let userApiClient: UserApiClient;

    test.beforeEach(async ({request}) => {
        userApiClient = new UserApiClient();
        await userApiClient.deleteAllUsers(request);
    });

    test('GET / - should return empty when no users', async ({request}) => {
        const users = await userApiClient.getUsers(request);
        expect(users).toEqual([]);
    });

    test('Create a few users and verify total count', async ({request}) => {
        const userCount = 4;
        const createdUsers = [];

        for (let i = 0; i < userCount; i++) {
            const user = await userApiClient.createUser(request);
            createdUsers.push(user);
        }

        const users = await userApiClient.getUsers(request);
        expect(users).toHaveLength(userCount);
        expect(users).toEqual(createdUsers); // Optional: Verify that created users match retrieved users
    });

    test('Create N users, delete all users, and verify empty response', async ({request}) => {
        const userCount = 4;

        for (let i = 0; i < userCount; i++) {
            await userApiClient.createUser(request);
        }

        await userApiClient.deleteAllUsers(request);

        const usersAfterDelete = await userApiClient.getUsers(request);
        expect(usersAfterDelete).toEqual([]);
    });

    test('Create N users, delete one user, and verify remaining users', async ({request}) => {
        const userCount = 4;
        const createdUsers: any[] = [];

        for (let i = 0; i < userCount; i++) {
            const user = await userApiClient.createUser(request);
            createdUsers.push(user);
        }

        // Delete the first user
        await userApiClient.deleteUserById(request, createdUsers[0].id);

        const remainingUsers = await userApiClient.getUsers(request);
        expect(remainingUsers).toHaveLength(userCount - 1);

        // Optional: Verify that the deleted user is indeed removed
        const deletedUser = remainingUsers.find((user: { id: any; }) => user.id === createdUsers[0].id);
        expect(deletedUser).toBeUndefined();
    });
})