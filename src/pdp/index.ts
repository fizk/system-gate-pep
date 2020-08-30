import type {IncomingHttpHeaders} from 'http';
import jwt from 'jsonwebtoken';
import type {User} from '../index.d';

export default (secret: string, url: string, method: string, headers: IncomingHttpHeaders): Promise<User> => {
    return new Promise((pass,fail) => {
        const authorization = (headers.authorization || '').match(/^(Bearer) (.*)$/) || ['null', 'null'];

        const decoded = jwt.decode(authorization[2], { complete: true });

        if (method.toLowerCase() === 'get') {
            const payload = (decoded && typeof decoded === 'object')
                ? decoded!.payload
                : {id: null}

            return pass(payload);
        }

        if (!headers.authorization) {
            return fail(new Error('Authorization header not provided'));
        }

        const authValue = headers.authorization.match(/^(Bearer) (.*)$/) || ['null', 'null'];

        jwt.verify(authValue[2], secret, function (error, decoded) {
            return error
                ? fail(error)
                : pass((decoded! as { payload: object}).payload as User);
        });
    });
}
