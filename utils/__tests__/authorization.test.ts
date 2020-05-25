import authorization from '../authorization';
import {Request} from 'jest-express/lib/request';
import {Response} from 'jest-express/lib/response';

describe('authorization', () => {
  it('rejects invalid tokens', () => {
    const next = jest.fn();
    const res = new Response();
    const req = new Request('', {
      headers: {
        authorization: 'Bearer invalid',
      },
    });

    // @ts-ignore
    authorization(req, res, next);

    expect(res.status).toBeCalledWith(401);
    expect(res.send).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('accepts valid tokens', () => {
    const next = jest.fn();
    const res = new Response();
    process.env.SALT = 'TEST_SALT';
    const req = new Request('', {
      headers: {
        authorization: 'Bearer 73737e37132857232ac182ff9ed1db52d29beefa',
        'user-agent': 'AA:BB:CC/123',
      },
    });

    // @ts-ignore
    authorization(req, res, next);

    expect(res.send).not.toHaveBeenCalled();
    expect(next).toBeCalled();
  });
});
