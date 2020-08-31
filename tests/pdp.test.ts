import fn from '../src/pdp';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

it('PDP - GET - token', async() => {
    const paylpad = await fn('', '', 'GET', {
        authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAifQ._aG0ukzancZqhL1wvBTJh8G8d3Det5n0WKcPo5C0DCY'
    });
    expect(paylpad).toEqual({ id: '1234567890'});
});
it('PDP - GET - no token', async() => {
    const paylpad = await fn('', '', 'GET', {});
    expect(paylpad).toEqual({id: null});
});

it('PDP - POST - no token', async() => {
    await expect(fn('', '', 'POST', {})).rejects
        .toThrow('Authorization header not provided');

    await expect(fn('', '', 'POST', {})).rejects
        .toThrowError(Error);
});

it('PDP - POST - no secret', async() => {
    await expect(fn('', '', 'POST', {
        authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAifQ._aG0ukzancZqhL1wvBTJh8G8d3Det5n0WKcPo5C0DCY'
    })).rejects.toThrow('secret or public key must be provided');

    await expect(fn('', '', 'POST', {
        authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAifQ._aG0ukzancZqhL1wvBTJh8G8d3Det5n0WKcPo5C0DCY'
    })).rejects.toThrowError(JsonWebTokenError);
});

it('PDP - POST - invalid secret', async() => {
    await expect(fn('invalid-secret', '', 'POST', {
        authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAifQ._aG0ukzancZqhL1wvBTJh8G8d3Det5n0WKcPo5C0DCY'
    })).rejects.toThrow('invalid signature');

    await expect(fn('invalid-secret', '', 'POST', {
        authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAifQ._aG0ukzancZqhL1wvBTJh8G8d3Det5n0WKcPo5C0DCY'
    })).rejects.toThrowError(JsonWebTokenError);
});

it('PDP - POST - valid secret / invalid token', async() => {
    await expect(fn('secret', '', 'POST', {
        authorization: 'Bearer yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAifQ.Tn0GaHKhAZZB9Y3fZwP4QDG-yvjUXMx3dzAbLKjCX9M'
    })).rejects.toThrow('invalid token');

    await expect(fn('secret', '', 'POST', {
        authorization: 'Bearer yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAifQ._aG0ukzancZqhL1wvBTJh8G8d3Det5n0WKcPo5C0DCY'
    })).rejects.toThrowError(JsonWebTokenError);
});

it('PDP - POST - valid secret / invalid exp value', async() => {
    await expect(fn('secret', '', 'POST', {
        authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJleHAiOiIyMDAxLTAxLTAxIn0.1DR22C63HpbugYgcHSQ5J1nqQimyRkG6Kn9woLx3HdE'
    })).rejects.toThrow('invalid exp value');

    await expect(fn('secret', '', 'POST', {
        authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJleHAiOiIyMDAxLTAxLTAxIn0.1DR22C63HpbugYgcHSQ5J1nqQimyRkG6Kn9woLx3HdE'
    })).rejects.toThrowError(JsonWebTokenError);
});

it('PDP - POST - valid secret / jwt expired', async() => {
    await expect(fn('secret', '', 'POST', {
        authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJleHAiOjB9.LJ0pATp68u7X8mDsKiYldx43Pnq7EbYjYZSiPgJIm7I'
    })).rejects.toThrow('jwt expired');

    await expect(fn('secret', '', 'POST', {
        authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJleHAiOjB9.LJ0pATp68u7X8mDsKiYldx43Pnq7EbYjYZSiPgJIm7I'
    })).rejects.toThrowError(TokenExpiredError);
});

it('PDP - POST - valid secret / valid token', async() => {
    const payload = await fn('secret', '', 'POST', {
        authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAifQ.Tn0GaHKhAZZB9Y3fZwP4QDG-yvjUXMx3dzAbLKjCX9M'
    });

    expect(payload).toEqual({ id: '1234567890'});
});

it('PDP - POST - valid secret / valid token / missing id', async() => {
    const payload = await fn('secret', '', 'POST', {
        authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibXkgbmFtZSJ9.qXDrtt-lJRSQxwlm-mHl7KfImVjCtd11aTOh5l7j-94'
    });

    expect(payload).toEqual({ id: null, name: 'my name'});
});
