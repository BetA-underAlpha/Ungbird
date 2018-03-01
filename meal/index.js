exports.getMeal = (req, res) => {

    var date = req.query.date;

    if (date === "today") {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        date = yyyy + mm + dd;
    }

    var request = require('request');
    var cheerio = require('cheerio');
    var Iconv = require('iconv').Iconv;


    request({
            uri: 'http://pusanjin.hs.kr/asp/food/FOOD_1001/main.html?siteid=pusanjinhs&boardid=food&uid=' + date + '&pagemode=view',
            encoding: null
        }, function (error, response, body) {

            try{

                if (error) {
                    res.status(200).json({"messages": [{"text": "아이쿠, 에러가 발생했네요...ㅠ reqException: " + error}]});
                } else {
                    var iconv = new Iconv('euc-kr', 'utf-8');

                    const $ = cheerio.load(iconv.convert(body).toString(), {decodeEntities: false});
                    const text$ = $("tr").find("td").find("table").find("tr").find("td").find("b");
                    const image$ = $('img');

                    var lunch = text$.eq(0).html();
                    var dinner = text$.eq(1).html();
                    var lunch_img = image$.eq(3).attr('src');
                    var dinner_img = image$.eq(5).attr('src');

                    var year = date.substr(0, 4);
                    var month = date.substr(4, 2);
                    var day = date.substr(6, 2);


                    var lunch_msg_json = {"text": year + "년 " + month + "월 " + day + "일의 점심 메뉴는 " + lunch + "입니다."};
                    var dinner_msg_json = {"text": year + "년 " + month + "월 " + day + "일의 저녁 메뉴는 " + dinner + "입니다."};
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
                    var json_list = [lunch_img_json, lunch_msg_json, dinner_img_json, dinner_msg_json];
                    var count = 0;


                    for (i = 0; i < 4; i++) {
                        if (check_list[i] !== null && check_list[i] !== undefined) {
                            json_content.push(json_list[i]);
                            count++;
                        }
                    }

                    if (count === 0) {
                        res.status(200).json({
                            "messages": [
                                {"text": "엥? 급식 데이터가 없네요? 날짜를 다시 확인해주세요. 방학 및 주말인 경우에는 급식이 안나옵니다 -.= (당연)"}
                            ]
                        });
                    }
                    res.status(200).json({
                        "messages": json_content,
                    });


                }

            } catch(exception){
                res.status(200).json({
                    "messages": [
                        {"text": "아...아앗! 뭔가 오류가 발생했어요... catchedException: " + exception}
                    ]
                });

            }

        }
    );


    res.status(200).json({
        "messages": [
            {"text": "아...아앗! 뭔가 중간에 처리되지 않은 코드가 있는거 같아요.. uncatchedException: lastcall"}
        ]
    });

};
  