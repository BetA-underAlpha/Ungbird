exports.getDic = (req, res) => {

    var request = require('request');
    var cheerio = require('cheerio');

    var word = req.query.word;
    var encoded_word = encodeURI(word);

    request({
            uri: 'http://endic.naver.com/search.nhn?sLn=kr&isOnlyViewEE=N&query=' + encoded_word//req.query.word,
            //encoding: null
        }, function (error, response, body) {
            try{

                if (error) {
                    res.status(200).json({
                        "messages": [
                            {
                                "attachment": {
                                    "type": "template",
                                    "payload": {
                                        "template_type": "button",
                                        "text": "'"+ word + "'에 대한 결과를 찾지 못했습니다.\nError : " + error,
                                        "buttons": [
                                            {
                                                "type": "web_url",
                                                "url": 'http://endic.naver.com/search.nhn?sLn=kr&isOnlyViewEE=N&query=' + encoded_word,
                                                "title": "자세히 보기"
                                            }
                                        ]
                                    }
                                }
                            }
                        ]
                    });
                    console.log("first : " + error);
                } else {
                    const $ = cheerio.load(body, {decodeEntities: false});
                    const uri$ = $(".fnt_e30").eq(0).find("a");

                    var uri = uri$.attr("href");
                    if (uri === null || uri === ""){
                        res.status(200).json({
                            "messages": [
                                {
                                    "attachment": {
                                        "type": "template",
                                        "payload": {
                                            "template_type": "button",
                                            "text": "'"+ word + "'에 대한 결과를 찾지 못했습니다.",
                                            "buttons": [
                                                {
                                                    "type": "web_url",
                                                    "url": uri,
                                                    "title": "자세히 보기"
                                                }
                                            ]
                                        }
                                    }
                                }
                            ]
                        });
                        console.log("결과 없음");
                    } else {
                        uri = "http://endic.naver.com" + uri$.attr("href");
                        console.log(uri);

                        request({
                            uri : uri
                        }, function (suberror, subresponse, subbody){
                            try{
                                if(suberror){
                                    res.status(200).json({
                                        "messages": [
                                            {
                                                "attachment": {
                                                    "type": "template",
                                                    "payload": {
                                                        "template_type": "button",
                                                        "text": "'"+ word + "'에 대한 결과를 찾지 못했습니다.\nError : " + suberror,
                                                        "buttons": [
                                                            {
                                                                "type": "web_url",
                                                                "url": uri,
                                                                "title": "자세히 보기"
                                                            }
                                                        ]
                                                    }
                                                }
                                            }
                                        ]
                                    });
                                    console.log("결과 없음");
                                } else {

                                    var text_shape = "";
                                    var text_meaning = "";
                                    var text_syn = "";

                                    if (word === encoded_word){

                                        console.log("ENG to KOR");

                                        const sub$ = cheerio.load(subbody, {decodeEntities: false});
                                        const shape$ = sub$(".sync").not(".sync.sync2");
                                        const syn$ = sub$(".sync.sync2");
                                        const syn_shape$ = syn$.find(".fnt_k10");
                                        const syn_eng$ = sub$(".sync.sync2").find(".fnt_e07");

                                        const meaning$ = sub$(".mean_on.meanClass").not(".arrow_mean.arrow_mean_off");

                                        eng_shape$ = shape$.find(".fnt_e07");
                                        kor_shape$ = shape$.find(".fnt_k10");

                                        for(var j=0; j<eng_shape$.length+1; j++){
                                            text_shape = text_shape + kor_shape$.eq(j).text() + " " + eng_shape$.eq(j).text() + "  ";
                                        }

                                        for(var m=0; m<meaning$.length; m++){
                                            text_meaning = text_meaning + (m+1) + ". " + meaning$.eq(m).find(".fnt_k04").text() + meaning$.eq(m).find(".fnt_k05").text() + meaning$.eq(m).find(".fnt_k06").text() + meaning$.eq(m).find(".fnt_k09").text() + "\n";
                                        }

                                        for(var z=0; z<syn_shape$.length; z++){
                                            text_syn = text_syn + syn_shape$.eq(z).text().trim() + " " + syn_eng$.eq(z).text() + "\n";
                                        }

                                        if(text_syn !== ""){
                                            text_syn = "유의어/반의어\n" + text_syn;
                                        }

                                        if(text_shape !== ""){
                                            text_shape = "활용형\n" + text_shape;
                                        }

                                        //console.log(syn$.html())
                                    } else {

                                        console.log("KOR to ENG");

                                        const sub$ = cheerio.load(subbody, {decodeEntities: false});
                                        const meaning$ = sub$(".fnt_e12");//.not(".arrow_mean.arrow_mean_off");


                                        for(var k=0; k<meaning$.length; k++){
                                            text_meaning = text_meaning + (k+1) + ". " + meaning$.eq(k).text() + "\n";
                                        }
                                    }

                                    var json_content = [];
                                    var check_list = [text_shape, text_syn];
                                    var json_meaning =
                                        {
                                            "attachment": {
                                                "type": "template",
                                                "payload": {
                                                    "template_type": "button",
                                                    "text": "뜻\n" + text_meaning,
                                                    "buttons": [
                                                        {
                                                            "type": "web_url",
                                                            "url": uri,
                                                            "title": "자세히 보기"
                                                        }
                                                    ]
                                                }
                                            }
                                        };

                                    for(var t in check_list){
                                        if(!(check_list[t] === null || check_list[t] === "" || check_list[t] === undefined)){
                                            json_content.push({"text": check_list[t]})
                                        }
                                    }

                                    json_content.push(json_meaning);

                                    res.status(200).json({
                                        "messages": json_content
                                    });


                                    console.log(text_shape);
                                    console.log(text_syn);
                                    console.log(text_meaning);
                                }
                            } catch (exception) {
                                res.status(200).json({
                                    "messages": [
                                        {"text": "아...아앗! 뭔가 오류가 발생했어요... catchedException: " + exception}
                                    ]
                                });
                                console.log(exception);
                            }
                        })

                    }




                }

            } catch(exception){
                res.status(200).json({
                    "messages": [
                        {"text": "아...아앗! 뭔가 오류가 발생했어요... catchedException: " + exception}
                    ]
                });
                console.log(exception);

            }

        }
    );

};
