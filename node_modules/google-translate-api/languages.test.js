var test = require('ava');
var Configstore = require('configstore');
var translate = require('./index.js');

const config = new Configstore('google-translate-api');

test.beforeEach(() => {
    config.clear();
});

test('translate from en to ps (Pashto) - Hello', async t => {
    const res = await translate('hello', {from: 'en', to: 'ps'});

    t.is(res.text, 'سلام');
});

test('translate from en to sq (Albanian) - Hello', async t => {
    const res = await translate('hello', {from: 'en', to: 'sq'});

    t.is(res.text, 'Përshëndetje');
});

test('translate from en to ar (Arabic) - Hello', async t => {
    const res = await translate('hello', {from: 'en', to: 'ar'});

    t.is(res.text, 'مرحبا');
});
