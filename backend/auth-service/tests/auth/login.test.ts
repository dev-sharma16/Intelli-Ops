import request from 'supertest';
import app from '../../src/app';
import { connectTestDB, closeTestDB, clearTestDB } from '../setup';

beforeAll(async () => await connectTestDB());
afterEach(async () => await clearTestDB());
afterAll(async () => await closeTestDB());

describe('User Login', () => {
  it('should login a user successfully', async () => {
  const userCreated = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });

    const cookies = res.headers["set-cookie"];

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  expect(res.body.message).toBe("Login successfull");
    expect(cookies).toBeDefined();
  });

  it('should not login if the user is not found', async () => {
  const userCreated = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'test2@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("No user found");
  })

  it('should not login user if the password is wrong', async () => {

    const CreateUser = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'test2@example.com',
      password: 'password123',
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'test2@example.com',
      password: 'password321',
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Invalid email or password');
    expect(res.body.success).toBe(false);
  });
});
