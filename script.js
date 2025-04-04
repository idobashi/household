let jsonData = [];  // JSONデータを格納する
let currentDate = new Date();  // 現在の月を取得
let isEditing = false; // 編集モードのフラグ
let paymentList = [];

// 非同期関数を修正
async function fetchData() {
    console.log('Before fetch');
    const response = await fetch('https://script.google.com/macros/s/AKfycbwWED3UvSynkd3cboBcNvTMd0z1k1GN53VQioBB-MDbEcTZsiSwVvz4G798dBuY-X4J/exec');
    const data = await response.json();
    console.log('取得したデータ:', data);
    return data; // データを返す
}

// JSONデータを取得してフィルタリング
async function loadJSON() {
    try {
        const data = await fetchData(); // ローカル変数に一旦格納

        if (typeof data === 'string') {
            jsonData = JSON.parse(data); // ← ここでグローバル変数に代入
        } else {
            jsonData = data;
        }

        updateTable(); // これで反映されるはず！
    } catch (e) {
        console.error('エラー:', e);
    }
}

// JSONデータをテーブルに表示（フィルタリングあり）
function updateTable() {
    let currentMonth = currentDate.getFullYear() + "-" + String(currentDate.getMonth() + 1).padStart(2, '0');
    let total = 0;
    document.getElementById("currentMonth").innerText = currentMonth; // 現在の月を表示
    jsonData.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    jsonData.forEach(entry => {
        if (entry.date && entry.date.startsWith(currentMonth)) {
            total += parseFloat(entry.price || 0);
        }
    });
    console.log('合計:', total);

    document.getElementById("totalAmount").innerText = "合計金額: " + total + "円";

    let table = `<table border='1'><tr>
                <th>日付</th>
                <th>項目</th>
                <th>金額</th>
                <th>支払い</th>
                <th>備考</th>
            </tr>`;

    jsonData.forEach(entry => {
    if (!entry.date.startsWith(currentMonth)) return; // 今月のデータ以外はスキップ

    let d = new Date(entry.date);
    let formattedDate = ("0" + (d.getMonth() + 1)).slice(-2) + "/" + ("0" + d.getDate()).slice(-2);

    let category = (entry.category.category1 === "食費")
                ? (entry.category.category2 === "食料品")
                ? `${entry.category.category1}\n<span class="small-text">(${entry.category.category2})</span>`
                : `${entry.category.category1}\n<span class="small-text">(${entry.category.category2} : ${entry.category.category3})</span>`
                : `${entry.category.category1}\n<span class="small-text">(${entry.category.category2})</span>`;

    let payment = (entry.payment.payment1 === "現金") 
                ? entry.payment.payment1 
                : entry.payment.payment2;
    let price = `${entry.price}円\n<span class="small-text">(内税:${entry.tax}円)</span>`;
    let remarks = `${entry.shop}\n${entry.remarks}`;
    paymentList.push(entry.payment.payment1);

    table += `<tr data-id="${entry.id}">
                <td>${formattedDate}</td>
                <td contenteditable="${isEditing}">${category.replace(/\n/g, "<br>")}</td>
                <td contenteditable="${isEditing}">${price.replace(/\n/g, "<br>")}</td>
                <td contenteditable="${isEditing}">${payment}</td>
                <td contenteditable="${isEditing}">${remarks.replace(/\n/g, "<br>")}</td>
            </tr>`;
    });

    table += "</table>";
    document.getElementById("jsonTable").innerHTML = table;
}


function showDetail() {
    var choice = document.getElementById("category").value;
    switch(choice){
        case "食費":
        // 食費詳細を表示
        document.getElementById("foodCategory1").style.display = "block";
        document.getElementById("foodCategory2").style.display = "none";
        document.getElementById("beautyCategory").style.display = "none";
        document.getElementById("medicalCategory").style.display = "none";
        document.getElementById("dailyNecessitiesCategory").style.display = "none";
        document.getElementById("socialCategory").style.display = "none";
        document.getElementById("entertainmentCategory").style.display = "none";
        document.getElementById("transportationCategory").style.display = "none";
        document.getElementById("utilityCategory").style.display = "none";
        document.getElementById("residenceCategory").style.display = "none";
        document.getElementById("othersCategory").style.display = "none";
        break;
        case "美容費":
        // 美容費詳細を表示
        document.getElementById("foodCategory1").style.display = "none";
        document.getElementById("foodCategory2").style.display = "none";
        document.getElementById("beautyCategory").style.display = "block";
        document.getElementById("medicalCategory").style.display = "none";
        document.getElementById("dailyNecessitiesCategory").style.display = "none";
        document.getElementById("socialCategory").style.display = "none";
        document.getElementById("entertainmentCategory").style.display = "none";
        document.getElementById("transportationCategory").style.display = "none";
        document.getElementById("utilityCategory").style.display = "none";
        document.getElementById("residenceCategory").style.display = "none";
        document.getElementById("othersCategory").style.display = "none";       
        break;   
        case "医療・保険費":
        document.getElementById("foodCategory1").style.display = "none";
        document.getElementById("foodCategory2").style.display = "none";
        document.getElementById("beautyCategory").style.display = "none";
        document.getElementById("medicalCategory").style.display = "block";
        document.getElementById("dailyNecessitiesCategory").style.display = "none";
        document.getElementById("socialCategory").style.display = "none";
        document.getElementById("entertainmentCategory").style.display = "none";
        document.getElementById("transportationCategory").style.display = "none";
        document.getElementById("utilityCategory").style.display = "none";
        document.getElementById("residenceCategory").style.display = "none";
        document.getElementById("othersCategory").style.display = "none"; 
        break;
        case "日用品費":
        document.getElementById("foodCategory1").style.display = "none";
        document.getElementById("foodCategory2").style.display = "none";
        document.getElementById("beautyCategory").style.display = "none";
        document.getElementById("medicalCategory").style.display = "none";
        document.getElementById("dailyNecessitiesCategory").style.display = "block";
        document.getElementById("socialCategory").style.display = "none";
        document.getElementById("entertainmentCategory").style.display = "none";
        document.getElementById("transportationCategory").style.display = "none";
        document.getElementById("utilityCategory").style.display = "none";
        document.getElementById("residenceCategory").style.display = "none";
        document.getElementById("othersCategory").style.display = "none";
        break;
        case "交際費":
        document.getElementById("foodCategory1").style.display = "none";
        document.getElementById("foodCategory2").style.display = "none";
        document.getElementById("beautyCategory").style.display = "none";
        document.getElementById("medicalCategory").style.display = "none";
        document.getElementById("dailyNecessitiesCategory").style.display = "none";
        document.getElementById("socialCategory").style.display = "block";
        document.getElementById("entertainmentCategory").style.display = "none";
        document.getElementById("transportationCategory").style.display = "none";
        document.getElementById("utilityCategory").style.display = "none";
        document.getElementById("residenceCategory").style.display = "none";
        document.getElementById("othersCategory").style.display = "none";
        break;
        case "娯楽費":
        document.getElementById("foodCategory1").style.display = "none";
        document.getElementById("foodCategory2").style.display = "none";
        document.getElementById("beautyCategory").style.display = "none";
        document.getElementById("medicalCategory").style.display = "none";
        document.getElementById("dailyNecessitiesCategory").style.display = "none";
        document.getElementById("socialCategory").style.display = "none";
        document.getElementById("entertainmentCategory").style.display = "block";
        document.getElementById("transportationCategory").style.display = "none";
        document.getElementById("utilityCategory").style.display = "none";
        document.getElementById("residenceCategory").style.display = "none";
        document.getElementById("othersCategory").style.display = "none";
        break;
        case "交通費":
        document.getElementById("foodCategory1").style.display = "none";
        document.getElementById("foodCategory2").style.display = "none";
        document.getElementById("beautyCategory").style.display = "none";
        document.getElementById("medicalCategory").style.display = "none";
        document.getElementById("dailyNecessitiesCategory").style.display = "none";
        document.getElementById("socialCategory").style.display = "none";
        document.getElementById("entertainmentCategory").style.display = "none";
        document.getElementById("transportationCategory").style.display = "block";
        document.getElementById("utilityCategory").style.display = "none";
        document.getElementById("residenceCategory").style.display = "none";
        document.getElementById("othersCategory").style.display = "none";
        break;
        case "水道・光熱費":
        document.getElementById("foodCategory1").style.display = "none";
        document.getElementById("foodCategory2").style.display = "none";
        document.getElementById("beautyCategory").style.display = "none";
        document.getElementById("medicalCategory").style.display = "none";
        document.getElementById("dailyNecessitiesCategory").style.display = "none";
        document.getElementById("socialCategory").style.display = "none";
        document.getElementById("entertainmentCategory").style.display = "none";
        document.getElementById("transportationCategory").style.display = "none";
        document.getElementById("utilityCategory").style.display = "block";
        document.getElementById("residenceCategory").style.display = "none";
        document.getElementById("othersCategory").style.display = "none";
        break;
        case "住まい全体":
        document.getElementById("foodCategory1").style.display = "none";
        document.getElementById("foodCategory2").style.display = "none";
        document.getElementById("beautyCategory").style.display = "none";
        document.getElementById("medicalCategory").style.display = "none";
        document.getElementById("dailyNecessitiesCategory").style.display = "none";
        document.getElementById("socialCategory").style.display = "none";
        document.getElementById("entertainmentCategory").style.display = "none";
        document.getElementById("transportationCategory").style.display = "none";
        document.getElementById("utilityCategory").style.display = "none";
        document.getElementById("residenceCategory").style.display = "block";
        document.getElementById("othersCategory").style.display = "none";
        break;
        case "その他":
        document.getElementById("foodCategory1").style.display = "none";
        document.getElementById("foodCategory2").style.display = "none";
        document.getElementById("beautyCategory").style.display = "none";
        document.getElementById("medicalCategory").style.display = "none";
        document.getElementById("dailyNecessitiesCategory").style.display = "none";
        document.getElementById("socialCategory").style.display = "none";
        document.getElementById("entertainmentCategory").style.display = "none";
        document.getElementById("transportationCategory").style.display = "none";
        document.getElementById("utilityCategory").style.display = "none";
        document.getElementById("residenceCategory").style.display = "none";
        document.getElementById("othersCategory").style.display = "block";
        break;
        default:
        document.getElementById("foodCategory1").style.display = "none";
        document.getElementById("foodCategory2").style.display = "none";
        document.getElementById("beautyCategory").style.display = "none";
        document.getElementById("medicalCategory").style.display = "none";
        document.getElementById("dailyNecessitiesCategory").style.display = "none";
        document.getElementById("socialCategory").style.display = "none";
        document.getElementById("entertainmentCategory").style.display = "none";
        document.getElementById("transportationCategory").style.display = "none";
        document.getElementById("utilityCategory").style.display = "none";
        document.getElementById("residenceCategory").style.display = "none";
        document.getElementById("othersCategory").style.display = "none";
    } 
}

function showFoodCategory2() {
    var choice = document.getElementById("foodType1").value;

    // 外食費が選ばれた場合に、食費詳細2を表示
    if (choice === "外食費") {
        document.getElementById("foodCategory2").style.display = "block";
    } else {
        document.getElementById("foodCategory2").style.display = "none";
    }
}

function showPaymentDetail() {
    var choice = document.getElementById("paymentType").value;
    if (choice === "銀行") {
        document.getElementById("bankCategory").style.display = "block";
        document.getElementById("cardCategory").style.display = "none";
    } else if(choice === "クレジットカード"){
        document.getElementById("bankCategory").style.display = "none";
        document.getElementById("cardCategory").style.display = "block";
    }else{
        document.getElementById("bankCategory").style.display = "none";
        document.getElementById("cardCategory").style.display = "none";
    }
}

function showPopup() {
  document.getElementById("overlay").style.display = "block";
  document.getElementById("modal").style.display = "block";
}

function closePopup() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("modal").style.display = "none";
  document.body.style.zoom = "100%";
  window.scrollTo({ top: 0, behavior: "smooth" }); // 上にスクロール
}

function sendData() {
    var date = document.getElementById("date").value;
    var category1 = document.getElementById("category").value;
    var category2 = "";
    var category3 = "";
    var shop = document.getElementById("shop").value;
    //var product = document.getElementById("product").value;
    var price = document.getElementById("price").value;
    var payment1 = document.getElementById("paymentType").value;
    var payment2 = payment1 === "クレジットカード" 
            ? document.getElementById("cardType").value 
            : payment1 === "銀行" 
            ? document.getElementById("bankType").value : "";
    var tax = document.getElementById("tax").value === ""
        ?0
        :document.getElementById("tax").value;

    var remarks = document.getElementById("remarks").value;

    //入力チェック
    if(!date){
        alert("日付を入力してください。")
        return;
    }
    if(!category1){
        alert("項目を選択してください。")
        return;
    }
    if(!payment1){
        alert("支払い方法を選択してください。")
        return;
    }
    if (!price || isNaN(price)) {
        alert("金額は数値で入力してください。");
        return;
    }

    // カテゴリの設定
    if (category1 === "食費") {
        category2 = document.getElementById("foodType1").value;
        if (category2 === "外食費") {
            category3 = document.getElementById("foodType2").value;
        }
    } else {
        category2 = getCategoryByType(category1);
    }

    // 🔥 ここがポイント：すでにあるデータなら `id` を維持
    var existingId = generateUniqueId();

    var newData = {
        id: existingId,
        date: date,
        category: {
        category1: category1,
        category2: category2,
        category3: category3,
        },
        shop: shop,
        product: "",
        price: price,
        tax:tax,
        payment: {
        payment1: payment1,
        payment2: payment2
        },
        remarks: remarks
    };

    console.log("送信するデータ:", newData); // 🔍 確認用

    // データ送信
    /*fetch('https://script.google.com/macros/s/AKfycbwWED3UvSynkd3cboBcNvTMd0z1k1GN53VQioBB-MDbEcTZsiSwVvz4G798dBuY-X4J/exec', {
        method: "POST",
        headers:{
            "Accept": "application/json",
            "Content-Type" : "application/x-www-form-urlencoded"
        },
        'body': JSON.stringify(jsonData),
        
        })
        .then(response => {
            console.log("1");
        return response.json();
        })
        .then(json => {
            console.log("2");
        // レスポンス json の処理
        })
        .catch(err => {
            console.log("3");
        // エラー処理
        });*/
    updateJSONData(newData);
    updateTable();
    alert("送信しました！");
    closePopup();
}

// 一意のIDを生成（UUID）
function generateUniqueId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
        v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
    });
}

// カテゴリの設定を簡素化するヘルパー関数
function getCategoryByType(category1) {
    switch (category1) {
    case "美容費":
    return document.getElementById("beautyType").value;
    case "医療・保険費":
    return document.getElementById("medicalType").value;
    case "日用品費":
    return document.getElementById("dailyNecessitiesType").value;
    case "交際費":
    return document.getElementById("socialType").value;
    case "娯楽費":
    return document.getElementById("entertainmentType").value;
    case "交通費":
    return document.getElementById("transportationType").value;
    case "水道・光熱費":
    return document.getElementById("utilityType").value;
    case "住まい全体":
    return document.getElementById("residenceType").value;
    case "その他":
    return document.getElementById("othersType").value;
    default:
    return "";  // デフォルトで空文字を返す
    }
}

// 初期データ読み込み
function onLoad() {
    loadJSON();
    const today = new Date().toISOString().split('T')[0];
    document.getElementById("date").value = today;
}

// 月を切り替える
function changeMonth(offset) {
    currentDate.setMonth(currentDate.getMonth() + offset);  // 月を変更
    updateTable();  // 表示を更新
}

function toggleEditMode() {
    isEditing = !isEditing;
    let tableCells = document.querySelectorAll("#jsonTable td");

    if (isEditing) {
        document.getElementById("editButton").innerText = "編集終了";
        tableCells.forEach(cell => {
        cell.contentEditable = true; // セルを編集可能に
        });
    } else {
        document.getElementById("editButton").innerText = "編集";
        tableCells.forEach(cell => {
            cell.contentEditable = false; // セルの編集を無効化
        });
        saveTableData(); // 編集終了時にデータ更新
    }
}

function saveTableData() {
    let rows = document.querySelectorAll("#jsonTable tr");
    rows.forEach((row, index) => {
        if (index === 0) return; // ヘッダー行はスキップ
        let cells = row.children;
        let id = row.dataset.id; // 各行のID
        let updatedEntry = jsonData.find(entry => entry.id === id);

        if (updatedEntry) {    
            //日付項目
            let d = new Date(cells[0].innerText);
            let formattedDate = ("0" + (d.getMonth() + 1)).slice(-2) + "/" + ("0" + d.getDate()).slice(-2);
            
            // カテゴリの分岐処理
            let categoryParts = cells[1].innerText.split("\n");
            updatedEntry.category.category1 = categoryParts[0].trim();
            if (categoryParts[1]) {
                let subParts = categoryParts[1].replace("(", "").replace(")", "").split(":");
                updatedEntry.category.category2 = subParts[0].trim();
                updatedEntry.category.category3 = subParts[1] ? subParts[1].trim() : "";
            }

            // 価格と内税の分岐
            let priceParts = cells[2].innerText.split("円\n");
            updatedEntry.price = priceParts[0].trim();
            let taxParts = priceParts[1].replace("(内税:", "").replace("円)", "") 
            updatedEntry.tax = taxParts;

            //支払い方法
            let paymentParts = cells[3].innerText;
            if (paymentParts === "現金") {
                updatedEntry.payment.payment1 = paymentParts;
                updatedEntry.payment.payment2 = "";
            } else {
                updatedEntry.payment.payment1 = paymentList[index];
                updatedEntry.payment.payment2 = paymentParts;
            }

            //店舗と備考の分割
            let remarksParts = cells[4].innerText.trim().split("\n");  // 前後の改行を削除
            updatedEntry.shop = remarksParts[0].trim();
            updatedEntry.remarks = "";  // ここで空文字列で初期化

            // 1番目から最後までの要素を結合
            for (let i = 1; i < remarksParts.length; i++) {  
                if (updatedEntry.remarks === "") {
                    updatedEntry.remarks = remarksParts[i].trim();  // 各要素を結合 
                } else {
                    updatedEntry.remarks += "\n" + remarksParts[i].trim();  // 各要素を結合
                }
            }
        }
    });
    let currentMonth = currentDate.getFullYear() + "-" + String(currentDate.getMonth() + 1).padStart(2, '0');
    let total = 0;
    jsonData.forEach(entry => {
        if (entry.date.startsWith(currentMonth)) { // 今月のデータのみ集計
          total += parseFloat(entry.price);
        }
      });
    document.getElementById("totalAmount").innerText = "合計金額: " + total + "円";
// まとめて JSON に反映
updateJSONData(JSON.stringify(jsonData));
}

function updateJSONData(newData) {
    console.log("updateJsonData");
    let newJsonData;
    let updatedContent = [];
    newJsonData = (typeof newData === "string") ? JSON.parse(newData) : newData;
    console.log("updateJsonData : " + newJsonData);

    let updated = false;
    for (let i = 0; i < jsonData.length; i++) {
        for (let j = 0; j < newJsonData.length; j++){
          if (jsonData[i].id === newJsonData[j].id) {
            Object.assign(jsonData[i], newJsonData[j]);
            updated = true;
          break;
        }
      }
    }
    console.log("updateJsonData : " + updated);
    if (!updated) {
       jsonData.push(newData);
    }
    //updatedContent = JSON.stringify(jsonData, null, 2);
    
    fetch('https://script.google.com/macros/s/AKfycbwWED3UvSynkd3cboBcNvTMd0z1k1GN53VQioBB-MDbEcTZsiSwVvz4G798dBuY-X4J/exec', {
    method: "POST",
    headers:{
        "Accept": "application/json",
        "Content-Type" : "application/x-www-form-urlencoded"
    },
    'body': JSON.stringify(jsonData),
    
    })
    .then(response => {
        console.log("1");
    return response.json();
    })
    .then(json => {
        console.log("2");
    // レスポンス json の処理
    })
    .catch(err => {
        console.log("3" + err.message);
    // エラー処理
    });
  }