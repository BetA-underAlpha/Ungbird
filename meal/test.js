var request = require('request');
var cheerio = require('cheerio');
var Iconv = require('iconv').Iconv;

var date = null;

console.log(date);
request({
        uri: 'http://pusanjin.hs.kr/asp/food/FOOD_1001/main.html?siteid=pusanjinhs&boardid=food&uid=' + date + '&pagemode=view',
        encoding: null
    }, function (error, response, body) {


        if (error) {
            res.status(200).json({"messages": [{"text": "Req err : "+error}]});
        } else {
            var iconv = new Iconv('euc-kr', 'utf-8');

            const $ = cheerio.load(iconv.convert(body).toString(),{decodeEntities: false});
            const text$ = $("tr").find("td").find("table").find("tr").find("td").find("b");
            const image$ = $('img');

            var lunch = text$.eq(0).html();
            var dinner = text$.eq(1).html();
            var lunch_img = image$.eq(3).attr('src');
            var dinner_img = image$.eq(5).attr('src');

            var year = date.substr(0,4);
            var month = date.substr(4,2);
            var day = date.substr(6,2);

            console.log(lunch);
            console.log(dinner);
            console.log(lunch_img);
            console.log(dinner_img);

            var lunch_msg_json = {"text" : year + "년 " + month + "월 " + day + "일의 점심 메뉴는 " + lunch + "입니다."};
            var dinner_msg_json = {"text" : year + "년 " + month + "월 " + day + "일의 저녁 메뉴는 " + dinner + "입니다."};
            var lunch_img_json = {
                "attachment": {
                    "type": "image",
                    "payload": {
                        "url": "http://pusanjin.hs.kr" + lunch_img
                    }
                }
            };
            var dinner_img_json = {
                "attachment": {
                    "type": "image",
                    "payload": {
                        "url": "http://pusanjin.hs.kr" + dinner_img
                    }
                }
            };


            var json_content = [];
            var check_list = [lunch_img, lunch, dinner_img, dinner];
            var json_list = [lunch_img_json,lunch_msg_json, dinner_img_json, dinner_msg_json];
            var count = 0;


            for (i = 0; i<4; i++){
                if(check_list[i] !== null && check_list[i] !== undefined){
                    json_content.push(json_list[i]);
                    count++;
                }
            }

            console.log(count)

            /*if (count === 0){
                res.status(200).json({
                    "messages":[
                        {"text":"엥? 급식 데이터가 없네요? 날짜를 다시 확인해주세요. 방학 및 주말인 경우에는 급식이 안나옵니다 -.= (당연)"}
                    ]
                })
            }
            res.status(200).json({
                "messages": json_content,
            });*/





        }
    }
);