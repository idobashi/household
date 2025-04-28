import { data, extraOptionsForEatingOut, paymentData, CONNECTION_URL, paymentInfo} from './const.js';
import { openFilter, clearFilter, searchJsonData} from './search.js';
import { generateUniqueId,closePopup } from './utils.js';
import {changeTotalTable,totalling} from './totaling.js'
import {paymentListTable,createPaymentTable} from './paymentList.js'

let jsonData = [];  // JSONデータを格納する
let currentDate = new Date();  // 現在の月を取得
let monthChangeFlg = false;

document.addEventListener('DOMContentLoaded', () => {
    console.log("ページが読み込まれました");
    const dataEntryButton = document.getElementById("dataEntryButton");
    const previousMonthButton = document.getElementById("previousMonthButton");
    const nextMonthButton = document.getElementById("nextMonthButton");
    const openFilterButton = document.getElementById("openFilter");
    const searchButton = document.getElementById("searchButton");
    const clearButton = document.getElementById("clearButton");
    const talbleButton = document.getElementById("changeTable");
    const changeTotalling = document.getElementById("changeTotalling");
    const paymentList = document.getElementById("paymentList");

    // イベントリスナーを設定
    dataEntryButton?.addEventListener("click", showPopup);
    previousMonthButton.addEventListener("click", () => changeMonth(-1));
    nextMonthButton.addEventListener("click", () => changeMonth(1));
    openFilterButton.addEventListener("click", openFilter);
    searchButton.addEventListener("click", searchData);
    clearButton.addEventListener("click", clearFilter);
    changeTotalling.addEventListener("click", () => {changeTotalTable(jsonData,currentDate,monthChangeFlg);});
    paymentList.addEventListener("click", () => {createPaymentTable(jsonData,currentDate,paymentInfo);});
    talbleButton.addEventListener("click", () => {showTable();});
});

function searchData(){
    const newJsonData = searchJsonData(jsonData);
    updateTable(newJsonData);
    const chartView = document.getElementById("chartView");
    const tableView = document.getElementById("jsonTable");
    const paymentView = document.getElementById("paymentTable");

    chartView.style.display = "none";
    tableView.style.display = "block";
    paymentView.style.display = "none";
    closePopup();
}


// 非同期関数を修正
async function fetchData() {
    console.log('Before fetch');
    const response = await fetch(CONNECTION_URL);
    const data = await response.json();
    console.log('取得したデータ:', data);
    return data; // データを返す
}

// JSONデータを取得してフィルタリング
async function loadJSON() {
    try {
        const data = await fetchData(); // ローカル変数に一旦格納

        if (typeof data === 'string') {
            jsonData = JSON.parse(data); 
        } else {
            jsonData = data;
        }

        updateTable();
    } catch (e) {
        console.error('エラー:', e);
    }
}

function showTable(){
    const chartView = document.getElementById("chartView");
    const tableView = document.getElementById("jsonTable");
    const paymentView = document.getElementById("paymentTable");

    chartView.style.display = "none";
    tableView.style.display = "block";
    paymentView.style.display = "none";
}

// JSONデータをテーブルに表示（フィルタリングあり）
function updateTable(newJsonData) {
    const tableData = typeof newJsonData === 'undefined' ? jsonData : newJsonData;
    let currentMonth = currentDate.getFullYear() + "-" + String(currentDate.getMonth() + 1).padStart(2, '0');
    
    let total = 0;

    document.getElementById("currentMonth").innerText = currentMonth; // 現在の月を表示

    tableData.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA - dateB;
      });
    
    tableData.forEach(entry => {
        if (entry.date && entry.date.startsWith(currentMonth)) {
            total += parseFloat(entry.amount || 0);
        }
    });
    console.log('合計:', total);

    document.getElementById("totalAmount").innerText = "合計金額: " + total + "円";

    let table = `<table border='1'><tr>
                <th>項目</th>
                <th>店舗/備考</th>
                <th>金額</th>
                <th>-</th>
            </tr>`;

    tableData.forEach(entry => {
    if (!entry.date.startsWith(currentMonth)) return; // 今月のデータ以外はスキップ

    let d = new Date(entry.date);
    let formattedDate = ("0" + (d.getMonth() + 1)).slice(-2) + "/" + ("0" + d.getDate()).slice(-2);
    const time = entry.time;
    
    let category = (entry.category.category1 === "食費")
                ? (entry.category.category2 === "食料品")
                    ? `${entry.category.category1}\n<span class="small-text">(${entry.category.category2})</span>`
                    : `${entry.category.category1}\n<span class="small-text">(${entry.category.category2} : ${entry.category.category3})</span>`
                : `${entry.category.category1}\n<span class="small-text">(${entry.category.category2})</span>`;

    let amount = (entry.payment.payment1 === "現金") 
                ? `${entry.amount}円\n<span class="small-text">(${entry.payment.payment1})</span>`
                : `${entry.amount}円\n<span class="small-text">(${entry.payment.payment2})</span>`
    
    let remarks = `${entry.shop}\n${entry.remarks}`;

    table += `<tr data-id="${entry.id}">
        <td><span class="small-text">${formattedDate} ${time}</span><br>${category.replace(/\n/g, "<br>")}</td>
        <td><br>${remarks.replace(/\n/g, "<br>")}</td>
        <td><br>${amount.replace(/\n/g, "<br>")}</td>
        <td>
        <br><a href="#" class="detailModalTrigger">詳細</a>
        </td>
    </tr>`;
    });

    table += "</table>";
    document.getElementById("jsonTable").innerHTML = table;
}

function showPopup() {
    const row = $(this).closest("tr");  // クリックされた <a> の親要素 <tr> を取得
    const entryId = row.data("id");  // 行のデータ属性からIDを取得
    const entryData = getDataById(entryId); // IDから該当のデータを取得
    const template = document.getElementById("inputFormTemplate");
    const clone = template.content.cloneNode(true);

    
    const date = new Date();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;

    clone.querySelector("#date").value = date.toISOString().split('T')[0];
    clone.querySelector("#time").value = formattedTime;
    
    const modalContainer = $("#detailModal");  // jQueryオブジェクト
    
    modalContainer.empty();  // 既存の内容をクリア
    modalContainer.append(clone);  // テンプレートを追加
    const overlay = $("#overlay");
    const modal = modalContainer.find(".modal");  // jQueryでクエリセレクターの代わり
    
    // オーバーレイとモーダルの表示
    overlay.show();
    modal.show(); 
    modalContainer.show();

    // オーバーレイのクリックでモーダルを非表示にする処理
    overlay.on("click", function() {
        modal.hide();
        overlay.hide();
        modalContainer.hide();
    });

    // ここで動的に追加された+ボタンにもイベントをバインド
    modalContainer.off("click", "#addInput").on("click", "#addInput", function () {
        $("#itemGroup").append(`
            <div class="input-group">
                <input type="text" name="item[]" placeholder="品目を入力">
                <input type="number" name="price[]" placeholder="金額を入力">
                <button type="button" class="removeInput">－</button>
            </div>
        `);
    });

    // 動的に追加された-ボタンに対して（削除機能）
    modalContainer.on("click", ".removeInput", function() {
        $(this).closest(".input-group").remove();  // クリックされたボタンの親要素(input-group)を削除
    });

    
    setupCategorySelects("#formContainer");
    setupPaymentCategorySelects("#paymentContainer");

    //idが取得できれば初期値のセット
    const extraWrapper = document.getElementById("extraSelectWrapper");
    if (typeof entryId !== 'undefined') {
        console.log("date : " + entryData.date);
        $("#date").val(entryData.date);
        $("#time").val(entryData.time);

        $("#mainCategory").val(entryData.category.category1);
        if (entryData.category.category2 !== "") {
            const subCategoryWrapper = document.getElementById("subCategoryWrapper");
            subCategoryWrapper.innerHTML = ""; // 念のためリセット
        
            const subSelect = createSelect("subCategory", data[$("#mainCategory").val()], "サブカテゴリ");
            subCategoryWrapper.appendChild(subSelect);
        
            // DOMに追加した後に値をセットする！
            $("#subCategory").val(entryData.category.category2);

            subSelect.addEventListener("change", function () {
                extraWrapper.innerHTML = "";
                const selectedCategory = this.value;
                if ($("#mainCategory").val() === "食費" && selectedCategory === "外食費") {
                    const extraSelect = createSelect("mealDetail", extraOptionsForEatingOut, "食事の種類");
                    extraWrapper.appendChild(extraSelect);
                }
            });
        }
        if (entryData.category.category3 === "" || entryData.category.category3 === null || typeof entryData.category.category3 === 'undefined') {
            //
        }else{
            
            extraWrapper.innerHTML = ""; // 念のため初期化
        
            const extraSelect = createSelect("mealDetail", extraOptionsForEatingOut, "食事の種類");
            extraWrapper.appendChild(extraSelect);
        
            // DOMに追加されたあとに値をセット！
            $("#mealDetail").val(entryData.category.category3);
        }

        $("#shop").val(entryData.shop);
        const itemGroup = modalContainer.find("#itemGroup");

        $('[name="item[]"]').val(entryData.product[0]);
        $('[name="price[]"]').val(entryData.price[0]);

        for (let i = 1; i < entryData.product.length; i++) {
            const product = entryData.product[i];
            const price = entryData.price[i];

             const inputGroup = $(`
                <div class="input-group">
                    <input type="text" name="item[]" value="${product}" placeholder="品目を入力">
                    <input type="number" name="price[]" value="${price}" placeholder="金額を入力">
                    <button type="button" class="removeInput">－</button>
                </div>
            `);
            itemGroup.append(inputGroup);
        }
        $("#paymentCategory").val(entryData.payment.payment1)
        console.log("支払い方法 : " + entryData.payment.payment1);
        if(entryData.payment.payment1 !== "現金"){
            const subPaymentCategoryWrapper = document.getElementById("subPaymentCategoryWrapper");
            subPaymentCategoryWrapper.innerHTML = ""; // 念のためリセット
        
            const subSelect = createSelect("subPaymentCategory", paymentData[$("#paymentCategory").val()], "サブカテゴリ");
            subPaymentCategoryWrapper.appendChild(subSelect);
        
            // DOMに追加した後に値をセットする！
            $("#subPaymentCategory").val(entryData.payment.payment2);
        }
        $("#amount").val(entryData.amount)
        $("#remarks").val(entryData.remarks)
    }

    modalContainer.off("input", "input[name='price[]']").on("input", "input[name='price[]']", function () {
        calculateTotalAmount();
    });

    modalContainer.off("click", ".removeInput").on("click", ".removeInput", function () {
        $(this).closest(".input-group").remove();
        calculateTotalAmount(); // ← 合計を再計算！
    });

    //送信ボタン押下時
    modalContainer.off("click", "#sendDataButton");
    modalContainer.on("click","#sendDataButton", function() {
        sendData(entryId);
    });
}

function setupCategorySelects(containerSelector) {

    const container = document.querySelector(containerSelector);
    if (!container) return;

    container.innerHTML = "";
    const heading = document.createElement("div");
    heading.textContent = "項目";
    heading.style.fontWeight = "bold";
    heading.style.marginBottom = "4px";
    container.appendChild(heading);

    const categorySelect = createSelect("mainCategory", Object.keys(data), "カテゴリ");
    container.appendChild(categorySelect);

    const subCategoryWrapper = document.createElement("div");
    subCategoryWrapper.id = "subCategoryWrapper";
    container.appendChild(subCategoryWrapper);

    const extraWrapper = document.createElement("div");
    extraWrapper.id = "extraSelectWrapper";
    container.appendChild(extraWrapper);

    categorySelect.addEventListener("change", function () {
        const selectedCategory = this.value;
        subCategoryWrapper.innerHTML = "";
        extraWrapper.innerHTML = "";

        if (data[selectedCategory]) {
            const subSelect = createSelect("subCategory", data[selectedCategory], "サブカテゴリ");
            subCategoryWrapper.appendChild(subSelect);

            subSelect.addEventListener("change", function () {
                extraWrapper.innerHTML = "";
                if (selectedCategory === "食費" && this.value === "外食費") {
                    const extraSelect = createSelect("mealDetail", extraOptionsForEatingOut, "食事の種類");
                    extraWrapper.appendChild(extraSelect);
                }
            });
        }
    });
}

function setupPaymentCategorySelects(containerSelector) {

    const container = document.querySelector(containerSelector);
    if (!container) return;

    container.innerHTML = "";

    const heading = document.createElement("div");
    heading.textContent = "支払い方法";
    heading.style.fontWeight = "bold";
    heading.style.marginBottom = "4px";
    container.appendChild(heading);

    const categorySelect = createSelect("paymentCategory", Object.keys(paymentData), "支払い方法");
    container.appendChild(categorySelect);

    const paymentWrapper = document.createElement("div");
    paymentWrapper.id = "paymentWrapper"
    container.appendChild(paymentWrapper);

    const subPaymentCategoryWrapper = document.createElement("div");
    subPaymentCategoryWrapper.id = "subPaymentCategoryWrapper";
    container.appendChild(subPaymentCategoryWrapper);

    categorySelect.addEventListener("change", function () {
        const selectedCategory = this.value;
        console.log(selectedCategory);
        subPaymentCategoryWrapper.innerHTML = "";

        if (paymentData[selectedCategory]) {
            if(selectedCategory !== "現金"){
                const subSelect = createSelect("subPaymentCategory", paymentData[selectedCategory], "サブカテゴリ");
                subPaymentCategoryWrapper.appendChild(subSelect);
            }
        }
    });
}



// 初期データ読み込み
function onLoad() {
    loadJSON();
}

$(document).ready(function () {
    onLoad();
  });

// 月を切り替える
function changeMonth(offset) {
    const tableView = document.getElementById("jsonTable"); // JSONテーブルエリア
    const chartView = document.getElementById("chartView");// グラフ描画エリア
    const paymentView = document.getElementById("paymentTable");

    const tableVisible = tableView.style.display;
    const chartVisible = chartView.style.display;
    console.log("chartView.style.display : " + chartView.style.display);
    const paymentVisible = paymentView.style.display;
    console.log("paymentView.style.display : " + window.getComputedStyle(paymentView).display);
    

    currentDate.setMonth(currentDate.getMonth() + offset);  // 月を変更

    updateTable();  // 表示を更新
    changeTotalTable(jsonData,currentDate,true);
    paymentListTable(jsonData,currentDate,paymentInfo);
    
    tableView.style.display = tableVisible;
    chartView.style.display = chartVisible;
    paymentView.style.display = paymentVisible;
    

}

function updateJSONData(newData) {

    let newJsonData;
    newJsonData = (typeof newData === "string") ? JSON.parse(newData) : [newData];  // newDataを配列として処理

    let updated = false;

    // JSONデータの更新処理
    $.each(jsonData, function(i, item) {
        $.each(newJsonData, function(j, newItem) {
            if (item.id === newItem.id) {
                $.extend(item, newItem);  // データを更新
                updated = true;
                return false;  // ループを抜ける
            }
        });
    });
    
    // 新しいデータがあれば追加
    if (!updated) {
        $.merge(jsonData, newJsonData);  // 配列を展開して追加
    }

    // サーバーに送信
    $.ajax({
        url: CONNECTION_URL,
        method: "POST",
        contentType: "application/x-www-form-urlencoded",
        dataType: "json",
        data: JSON.stringify(jsonData),
        success: function(response) {
            console.log("1");
            // レスポンス処理
        },
        error: function(err) {
            console.log("3", err.message);
            // エラー処理
        }
    });
}
  
// 詳細モーダルを開く
$(document).on("click", ".detailModalTrigger", function(e) {
    e.preventDefault();
    showPopup.call(this);
});

export function getDataById(id) {
    return jsonData.find(entry => entry.id === id);
}
// セレクトボックス作成関数
export function createSelect(id, options, placeholder) {
    const select = document.createElement("select");
    select.id = id;
    select.name = id;

    const defaultOption = document.createElement("option");
    defaultOption.text = `-- ${placeholder}を選択 --`;
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);


    options.forEach(optionText => {
        const option = document.createElement("option");
        option.value = optionText;
        option.text = optionText;
        select.appendChild(option);
    });
    return select;
}

export function calculateTotalAmount() {
    let total = 0;
    $("input[name='price[]']").each(function () {
        const val = parseFloat($(this).val());
        if (!isNaN(val)) {
            total += val;
        }
    });
    $("#amount").val(total); // 合計をセット（例としてamountフィールドに）
}

function sendData(entryId) {
    const date = $("#date").val();
    const time = $("#time").val();
    const category1 = $("#mainCategory").val();
    const category2 = $("#subCategory").val();
    const category3 = $("#mealDetail").val() === null ? "" :$("#mealDetail").val(); 
    const shop = $("#shop").val();
    const product = $("input[name='item[]']").map(function() {
        return $(this).val();
    }).get();
    const price = $("input[name='price[]']").map(function() {
        return $(this).val();
    }).get();
    const amount = $("#amount").val();
    const payment1 = $("#paymentCategory").val();

    const payment2 = $("#subPaymentCategory").val();

    const remarks = $("#remarks").val();

    // 入力チェック
    if (!date) {
        alert("日付を入力してください。");
        return;
    }
    console.log(category1);
    if (!category1) {
        alert("項目を選択してください。");
        return;
    }
    if (!payment1) {
        alert("支払い方法を選択してください。");
        return;
    }

    for (let i = 0; i < price.length; i++) {
        if (!price[i] || isNaN(price[i])) {
            alert("金額は数値で入力してください。");
            return;
        }
    }

    var existingId = typeof entryId === 'undefined' ?generateUniqueId():entryId;

    var newData = {
        id: existingId,
        date: date,
        time: time,
        category: {
            category1: category1,
            category2: category2,
            category3: category3,
        },
        shop: shop,
        product: product,
        price: price,
        amount: amount,
        payment: {
            payment1: payment1,
            payment2: payment2
        },
        remarks: remarks
    };
    updateJSONData(newData);
    updateTable();
    alert("送信しました！");
    closePopup();
    totalling(jsonData,currentDate,true);
    paymentListTable(jsonData,currentDate,paymentInfo);
}

  
  
  