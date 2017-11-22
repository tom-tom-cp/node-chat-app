var expect = require('expect');
var {generateMessage} = require('./message');

describe('generate message', () => {
    it('should generate the correct message object', () => {
        var from = 'Jen';
        var text = 'Some message';

        var message = generateMessage(from, text);

        expect(typeof message.createdAt).toBe('number');
        expect(message).toMatchObject({
            from: from,
            text: text
        });
    });
});
