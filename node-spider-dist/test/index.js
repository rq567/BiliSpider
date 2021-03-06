import test from 'ava';

const {
    URL_GET_PACKAGE, URL_USER_INFO, URL_UPLOAD_PACKAGE, SLEEP_NORMAL
} = require('../constants');
const { setMock } = require('../utils');
const mock = setMock(require('superagent-mocker'));
const { process } = require('../spider');

mock.get(URL_GET_PACKAGE, (req) => {
    const body = { 'success': true, 'pid': 1234 };
    return {
        body, text: JSON.stringify(body)
    };
});

test('Default', async (t) => {
    let startTime;
    mock.get(URL_USER_INFO, (req) => {
        const body = require('./user-info.json');
        return {
            body, text: JSON.stringify(body)
        };
    });
    mock.post(URL_UPLOAD_PACKAGE, (req) => {
        const body = {
            pid: req.body.pid,
            package: JSON.parse(req.body.package)
        };
        t.is(body.pid, 1234);
        t.is(body.package.length, 1000);
        t.true((Date.now() - startTime) >= SLEEP_NORMAL * 1000);
        return { };
    });
    startTime = Date.now();
    await process();
});
