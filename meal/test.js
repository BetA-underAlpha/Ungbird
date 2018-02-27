var request = require('request');
var cheerio = require('cheerio');
var Iconv = require('iconv').Iconv;

var date = "asdfasdf";

var options = {
    uri: 'http://pusanjin.hs.kr/asp/food/FOOD_1001/main.html?siteid=pusanjinhs&boardid=food&uid=' + date + '&pagemode=view',
    encoding: null
};


request(options, function (error, response, body) {


    if (error) {
        throw error
    }

    var iconv = new Iconv('euc-kr', 'utf-8');
    const html = iconv.convert(body).toString();

    const $ = cheerio.load(html,{decodeEntities: false});
    const text$ = $("tr").find("td").find("table").find("tr").find("td").find("b");
    const image$ = $('img');

    var lunch = text$.eq(0).html();
    var dinner = text$.eq(1).html();

    var lunch_img = "http://pusanjin.hs.kr"+image$.eq(3).attr('src');
    var dinner_img = image$.eq(5).attr('src');

    console.log(lunch);
    console.log(dinner);

    console.log(lunch_img);
    console.log(dinner_img);

    console.log(typeof dinner_img);

    test("hello");

});

function test(message){
    console.log(message);
}