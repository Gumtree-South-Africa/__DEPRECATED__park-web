var utils = require('../app/services/util-service');

describe('Util-Service functions use properly', function() {

	it('getBotMetaContent must be ok for group path', function() {
		var path = '/gr/group/1111';
		var canonical = 'https://vivanuncios.us/gr/group/1111';
		expect(utils.getBotMetaContent(path, canonical)).toBe('index, follow');
	});

	it('getBotMetaContent must be ok for group path', function() {
		var path = '/gr/group/1111';
		var canonical = 'http://vivanuncios.us/gr/group/1111';
		expect(utils.getBotMetaContent(path, canonical)).toBe('index, follow');
	});

	it('getBotMetaContent must be ok for group path', function() {
		var path = '/gr/group/1111';
		var canonical = 'https://www.vivanuncios.us/gr/group/1111';
		expect(utils.getBotMetaContent(path, canonical)).toBe('index, follow');
	});

	it('getBotMetaContent must be ok for group path', function() {
		var path = '/gr/group/1111';
		var canonical = 'http://www.vivanuncios.us/gr/group/1111';
		expect(utils.getBotMetaContent(path, canonical)).toBe('index, follow');
	});

	it('getBotMetaContent must be wrong for group path', function() {
		var path = '/gr/grouppps/1111';
		var canonical = 'https://vivanuncios.us/gr/group/1111';
		expect(utils.getBotMetaContent(path, canonical)).not.toBe('index, follow');
	});

});
