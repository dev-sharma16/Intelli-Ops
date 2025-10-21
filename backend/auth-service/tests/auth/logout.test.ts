import request from 'supertest';
import app from '../../src/app';
import { connectTestDB, closeTestDB, clearTestDB } from '../setup';
import { ILoginedUser } from '../../src/types/user.type';

let loginedUser: ILoginedUser;
let cookie: string;

beforeAll(async () => {
  await connectTestDB();
  const userCreated = await request(app).post('/api/auth/register').send({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  });

  const loginRes = await request(app).post('/api/auth/login').send({
    email: 'test@example.com',
    password: 'password123',
  });

  loginedUser = loginRes.body.user;
  cookie = loginRes.headers['set-cookie'];
});
afterEach(async () => await clearTestDB());
afterAll(async () => await closeTestDB());

describe('Logout Current User', () => {
  it('should return logout current user', async () => {
    const res = await request(app).post('/api/auth/logout').set('Cookie', cookie);

    const clearedCookie = res.headers['set-cookie'];

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("User logged out successfully");
    expect(clearedCookie[0]).toMatch(/token=;/);
  });

  it('should not logout user if user is not logined', async () => {
    const res = await request(app).post('/api/auth/logout');

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Unautherized, No token found');
  });
});
