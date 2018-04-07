var request = require('request');
var cheerio = require('cheerio');
var Iconv = require('iconv').Iconv;

//var word_iconv = new Iconv('cp949', 'utf-8');
var word = '배고프다';
word = encodeURI(word);

//word = word_iconv.convert(word);
request({
        uri: 'http://endic.naver.com/search.nhn?sLn=kr&isOnlyViewEE=N&query=' + word//req.query.word,
        //encoding: null
    }, function (error, response, body) {
        //console.log(word);
        //console.log(body);

        try{

            if (error) {
                console.log("first : " + error);
                //res.status(200).json({"messages": [{"text": "아이쿠, 에러가 발생했네요...ㅠ reqException: " + error}]});
            } else {
                //var iconv = new Iconv('euc-kr', 'utf-8');
                //const $ = cheerio.load(iconv.convert(body).toString(), {decodeEntities: false});
                const $ = cheerio.load(body, {decodeEntities: false});
                const kind$ = $(".fnt_k09");
                const mean$ = $(".fnt_k05");
                const submean$ = $(".fnt_k22");
                const moremean$ = $(".fnt_k14");
                const uri$ = $(".fnt_e30").eq(0).find("a");

                var checknull = mean$.eq(0).html();
                if (checknull === null || checknull === ""){
                    console.log("결과 없음");
                } else {

                    //console.log(uri$.eq(0).html());
                    var meaning = kind$.eq(0).html().toString() + " " + mean$.eq(0).html().toString();
                    var uri = "http://endic.naver.com" + uri$.attr("href");
                    var submeaning = "";
                    var moremean = "";

                    if(!(moremean$.eq(0).html() === null || moremean$.eq(0).html()==="" || moremean$.eq(0).html() === undefined)){
                        moremean = moremean$.eq(0).html() + "개의 뜻 더보기";
                    }


                    for (var i = 1; i<submean$.length+1; i++){
                        var testmean = submean$.eq(i).html().toString();
                        if(testmean.indexOf("</") !== -1){
                            break;
                        }
                        submeaning = submeaning + submean$.eq(i).html().toString();
                    }


                    //console.log(mean$.html().toString());
                    console.log(meaning);
                    console.log(submeaning);
                    console.log(uri);
                    console.log(moremean);

                }




            }

        } catch(exception){
            /*res.status(200).json({
                "messages": [
                    {"text": "아...아앗! 뭔가 오류가 발생했어요... catchedException: " + exception}
                ]
            });*/
            console.log(exception);

        }

    }
);