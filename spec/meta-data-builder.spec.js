var metaData = require('../app/meta-data-builder');


describe('Meta-data-builder functions return builder object as expected', function() {

  describe('Builder for Group data', function() {
    var GROUP_DATA;
    var GROUP_DATA_BUILDED;
    beforeEach(function() {
      GROUP_DATA = require('../app/data/group.json');
      GROUP_DATA_BUILDED = require('../app/data/group-render.json')
    });

    it('groupData when data is right and path is ok', function() {
      var path = '/gr/tutifruti/1147';
      var groupData = metaData.groupData(GROUP_DATA, 'https://www.vivanuncios.us', path, {id:'houston-tx'});
      expect(groupData.data).toEqual(GROUP_DATA_BUILDED.data);
      expect(groupData.seo).toEqual(GROUP_DATA_BUILDED.seo);
      expect(groupData.facebook).toEqual(GROUP_DATA_BUILDED.facebook);
      expect(groupData.twitter).toEqual(GROUP_DATA_BUILDED.twitter);
    });

    it('groupData when data is right and path is wrong format', function() {
      var path = '/gr/tutifrutiisis/1147';
      var groupData = metaData.groupData(GROUP_DATA, 'https://www.vivanuncios.us', path, {id:'houston-tx'});
      expect(groupData.data).toEqual(GROUP_DATA_BUILDED.data);
      expect(groupData.seo).not.toEqual(GROUP_DATA_BUILDED.seo);
      expect(groupData.facebook).toEqual(GROUP_DATA_BUILDED.facebook);
      expect(groupData.twitter).toEqual(GROUP_DATA_BUILDED.twitter);
    });

  });

  describe('Builder for User data', function() {
    var USER_DATA;
    var USER_DATA_BUILDED;

    beforeEach(function() {
      USER_DATA = require('../app/data/user.json');
      USER_DATA_BUILDED = require('../app/data/user-render.json');
    });

    it('userData when data is right and path is ok', function() {
      var path = '/profile/veritocuatro345';
      var userData = metaData.userData(USER_DATA, 'https://www.vivanuncios.us', path, {id:'houston-tx'});
      expect(userData.data).toEqual(USER_DATA_BUILDED.data);
      expect(userData.seo).toEqual(USER_DATA_BUILDED.seo);
      expect(userData.facebook).toEqual(USER_DATA_BUILDED.facebook);
      expect(userData.twitter).toEqual(USER_DATA_BUILDED.twitter);
    });

  });

  describe('Builder for Serch by categories', function() {
    var CATEGORIES;
    var CATEGORY_ITEMS;
    var LOCATION;
    var DATA_BUILDED;
    var req = {};

    beforeEach(function() {
      CATEGORIES = require('../app/data/categories.json');
      CATEGORY_ITEMS = require('../app/data/category-items.json');
      LOCATION = require('../app/data/ny-location.json');
      DATA_BUILDED = require('../app/data/category-render.json');
      req.protocol = 'https';
      req.hostname = 'www.vivanuncios.us';
      req.params = {};
      req.params.category = 'electrodomesticos';
      req.path = '/c/new-york-ny/electrodomesticos';
      req.mapBox = {id:'houston-tx'};
    });

    it('searchByCategoryData ', function() {
      var search =  CATEGORY_ITEMS;
      search.categories = CATEGORIES.categories;
      search.locationCanonical = LOCATION.canonical_name;
      var data = metaData.searchByCategoryData(search,req);
      expect(data.data.categories).toEqual(DATA_BUILDED.data.categories);
      expect(data.data.metaH1).toEqual(DATA_BUILDED.data.metaH1);
      expect(data.data.items).toEqual(DATA_BUILDED.data.items);
      expect(data.data.locationCanonical).toEqual(DATA_BUILDED.data.locationCanonical);
      expect(data.data.categories).toEqual(DATA_BUILDED.data.categories);
      expect(data.seo).toEqual(DATA_BUILDED.seo);
      expect(data.facebook).toEqual(DATA_BUILDED.facebook);
      expect(data.twitter).toEqual(DATA_BUILDED.twitter);
    });

  });

});

