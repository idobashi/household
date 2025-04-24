//本番環境用
//const CONNECTION_URL = 'https://script.google.com/macros/s/AKfycbwWED3UvSynkd3cboBcNvTMd0z1k1GN53VQioBB-MDbEcTZsiSwVvz4G798dBuY-X4J/exec';
//検証環境用
export const CONNECTION_URL = 'https://script.google.com/macros/s/AKfycbxMupHOKq5AKbC0wPLRB3-MJAOt6eE9uWS6Lw-_qvw2CZCPatMoJSWqKnFKjSRNq_kjUA/exec';

export const data = {
    "食費": ["食料品", "外食費", "その他"],
    "美容費": ["美容院・サロン", "化粧品", "洋服", "下着", "その他"],
    "医療・保険費": ["病院代", "薬代","その他"],
    "日用品費": ["消耗品", "清掃用品", "日用雑貨", "その他"],
    "交際費": ["プレゼント", "ご祝儀・香典", "その他"],
    "娯楽費": ["旅行", "イベント", "映画","漫画・本","その他"],
    "交通費": ["電車", "バス", "タクシー","飛行機", "その他"],
    "水道・光熱費": ["水道", "電気", "ガス", "その他"],
    "住まい全体": ["家賃", "家電", "家具", "雑貨","その他"],
    "その他": []
};

export const extraOptionsForEatingOut = ["朝ごはん", "昼ごはん", "夜ごはん", "カフェ", "その他"];
export const paymentData = {
        "現金":[],
        "クレジットカード":["楽天","paypay"],
        "銀行":["りそな銀行"]
    }

export const paymentInfo = [ 
    {
        "payment":"楽天",
        "periodStart":"1",
        "periodEnd":"末日",
        "paymentDate":"27"
    },
    {
        "payment":"paypay",
        "periodStart":"1",
        "periodEnd":"末日",
        "paymentDate":"27"
    },
    {
        "payment":"現金",
        "periodStart":"1",
        "periodEnd":"末日",
        "paymentDate":""
    },
    {
        "payment":"りそな銀行",
        "periodStart":"1",
        "periodEnd":"末日",
        "paymentDate":""
    },
]
